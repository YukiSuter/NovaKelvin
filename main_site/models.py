from django.db import models

class CommitteeMember(models.Model):
    name = models.CharField(max_length=100, unique=False)
    role = models.CharField(max_length=100, unique=False)
    email= models.EmailField(unique=False)
    image = models.ImageField(upload_to='static/img/committee/', blank=True, unique=False)
    order = models.IntegerField(blank=True, null=True)


    def __str__(self):
        return f"{self.role} ({self.name})"
# Create your models here.

class PastConcert(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField(help_text="Rough date of concert")
    venue = models.CharField(max_length=200, blank=True, null=True)
    conductor = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    programme = models.TextField(blank=True, help_text="List of pieces performed")

    class Meta:
        ordering = ['-date']  # Most recent first
        verbose_name_plural = "Past Concerts"

    def __str__(self):
        return f"{self.title}"