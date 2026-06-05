import factory

from apps.portfolio.models import Project


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project

    title = "Test Project"
    summary = "Test Summary"
    description = "Test Description"