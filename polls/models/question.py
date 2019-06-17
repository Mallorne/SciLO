from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from .user import User
from .variable import VariableField


class QuestionManager(models.Manager):
    def with_query(self, results=None, page=None, sort='id', order='ASC'):
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("""
                WITH q(n, id) AS (
                SELECT ROW_NUMBER() OVER (ORDER BY %s %s) AS n, id
                FROM polls_question
                )
                SELECT *
                FROM q, polls_question pq
                WHERE pq.id = q.id
                ORDER BY q.n""", [sort, order])
            result_list = []
            for row in cursor.fetchall():
                question = self.model(**row)
                result_list.append(question)
        return result_list


class Question(models.Model):
    '''
    this class is to represent a question, a question should contains
    at least one response (Reponse Object), and relative answers
    (Answer Object)

    title: string, question title, max size is 200, example: "derivate
    problem"

    background: string, question background information

    weight: int, the total weight in question, example: 100

    create_date: Date

    last_modify_date: Date

    author: User, user who creates this question

    tag: Tag, the tag this question has

    quizzes: [Quiz], the quizzes contains this question

    responses: [Response], the reponses contains in this question

    variables: [Variable]

    '''

    class Meta:
        app_label = 'polls'

    title = models.CharField(max_length=200)
    text = models.TextField(blank=True)
    create_date = models.DateTimeField(default=timezone.now)
    last_modify_date = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    tags = models.ManyToManyField('Tag')
    quizzes = models.ManyToManyField('Quiz', through='QuizQuestion')
    variables = ArrayField(VariableField(), default=list, blank=True)
    objects = QuestionManager()

    def __str__(self):
        return super().__str__()+' title: '+str(self.title)


class QuestionAttempt(models.Model):
    '''
    grade: the current grade

    question: Question, a question this question attempt belongs to

    author: User, who write this attempt

    quiz_attemp: QuizAttempt, a quiz attempt this question attempt
    belongs to

    response_attempts: [ResponseAttempt], each reponses in question has a
    response attempt


    '''
    class Meta:
        app_label = 'polls'

    grade = models.FloatField(default=0)

    quiz_attempt = models.ForeignKey('QuizAttempt', on_delete=models.CASCADE,
                                     related_name="question_attempts",
                                     blank=True, null=True)
    question = models.ForeignKey("Question", on_delete=models.CASCADE,
                                 related_name="question_attempts")

    def get_response_attempts(self, **kwargs):
        return self.response_attempts.filter(**kwargs)
