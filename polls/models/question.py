
from datetime import datetime
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from .user import User
from .category import QuestionCategory


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

    category: QuestionCategory, the category this question belongs to

    quizzes: [Quiz], the quizzes contains this question

    responses: [Response], the reponses contains in this question

    variables: [Variable]

    '''

    class Meta:
        app_label = 'polls'

    title = models.CharField(max_length=200)
    background = models.TextField(default='')
    weight = models.PositiveSmallIntegerField(default=100)
    create_date = models.DateTimeField(default=timezone.now)
    last_modify_date = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    category = models.ForeignKey(
        QuestionCategory, related_name="questions",
        on_delete=models.CASCADE, null=True, blank=True
    )
    quizzes = models.ManyToManyField('Quiz', through='QuizQuestion')

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

    responses: [Response], question can contain mutiple reponses

    '''
    class Meta:
        app_label = 'polls'

    grade = models.FloatField(default=0)

    quiz_attempt = models.ForeignKey('QuizAttempt', on_delete=models.CASCADE,
                                     related_name="question_attempts",
                                     blank=True, null=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE,
                                 related_name="question_attempts")
