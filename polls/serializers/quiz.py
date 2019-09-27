from datetime import datetime, timezone
from django.utils.dateparse import parse_datetime
from rest_framework import serializers
from polls.models import Quiz, QuizQuestion
from .question import QuestionSerializer
from .utils import FieldMixin


def validated_questions(questions):
    if questions is None:
        return
    for q in questions:
        if q.get('id', None) is None:
            raise Exception("each question in questions must contain id")


def compute_quiz_status(start, end, late):
    status = None
    now = datetime.now(timezone.utc)

    if start and now < start:
        status = 'not_begin'
    if end and start and now > start and now < end:  # pylint:disable=chained-comparison
        status = 'processing'
    if end and now > end:
        if (late and now > late) or late is None:
            status = 'done'
        else:
            status = 'late'

    return status


class QuizSerializer(FieldMixin, serializers.ModelSerializer):
    start_end_time = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = '__all__'

    def to_representation(self, obj):
        obj_dict = super().to_representation(obj)
        # convert back to 'start-end-time'

        obj_dict.pop('begin_date', None)
        obj_dict.pop('end_date', None)

        if obj_dict.get('questions', None):
            question_quiz_list = QuizQuestion.objects.filter(quiz_id=obj.id).order_by('position')
            serializer = QuestionSerializer(
                obj.questions.all().order_by('questionlinkback__position'),
                context=self.context.get('question_context', {}),
                many=True)
            obj_dict['questions'] = serializer.data
            for index, qqlink in enumerate(question_quiz_list):
                if str(obj_dict['questions'][index]['id']) == str(qqlink.question_id):
                    if qqlink.mark:
                        obj_dict['questions'][index]['mark'] = qqlink.mark
                else:
                    raise Exception('question order does not work properly')

        return obj_dict

    def to_internal_value(self, data):
        dates = data.pop('start_end_time', None)
        if dates and isinstance(dates, list) and len(dates) == 2:
            data['begin_date'] = parse_datetime(dates[0])
            data['end_date'] = parse_datetime(dates[1])
            # show_solution_date must be bigger than end date
            if data.get('show_solution_date', None) is None:
                data['show_solution_date'] = parse_datetime(dates[1])
            else:
                data['show_solution_date'] = parse_datetime(data['show_solution_date'])
            if data['show_solution_date'] < data['end_date']:
                raise Exception('End date should not bigger than show solution date')

        questions = data.pop('questions', None)
        data = super().to_internal_value(data)
        validated_questions(questions)  # check if each question has a id
        data['questions'] = questions
        return data

    def create(self, validated_data):
        questions = validated_data.pop('questions', [])
        quiz = super().create(validated_data)
        quiz.update_quiz_question_links(questions)
        return quiz

    def update(self, instance, validated_data):
        questions = validated_data.pop('questions', None)
        if not self.partial:  # if PUT
            # reset end_date, begin_date if they are not provided
            validated_data['end_date'] = validated_data.pop('end_date', None)
            validated_data['begin_date'] = validated_data.pop('begin_date', None)
            # reset questions
            if questions is None:
                questions = []
        if self.partial:
            # if partial and not update end_date, check instance's end_date
            if validated_data.get('end_date', None) is None and instance.end_date:
                if validated_data['show_solution_date'] < instance.end_date:
                    raise Exception('End date should bigger than show solution date')

        quiz = super().update(instance, validated_data)
        quiz.update_quiz_question_links(questions)

        return quiz

    def get_start_end_time(self, obj):
        return [obj.begin_date, obj.end_date]

    def get_status(self, obj):
        return compute_quiz_status(obj.begin_date, obj.end_date, obj.late_time)

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = '__all__'
        read_only_fields = ['position', ]
