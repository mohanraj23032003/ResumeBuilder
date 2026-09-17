from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("students", "0004_studentprojectselection_delete_project"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[

                # Remove old integer constraints
                migrations.RunSQL(
                    """
                    ALTER TABLE students_education
                    DROP CONSTRAINT IF EXISTS students_education_start_year_check;

                    ALTER TABLE students_education
                    DROP CONSTRAINT IF EXISTS students_education_end_year_check;
                    """,
                    reverse_sql="""
                    ALTER TABLE students_education
                    ADD CONSTRAINT students_education_start_year_check
                    CHECK (start_year >= 0);

                    ALTER TABLE students_education
                    ADD CONSTRAINT students_education_end_year_check
                    CHECK (end_year >= 0);
                    """,
                ),

                # Convert start_year: 2022 -> 2022-01-01
                migrations.RunSQL(
                    """
                    ALTER TABLE students_education
                    ALTER COLUMN start_year TYPE date
                    USING make_date(start_year, 1, 1);
                    """,
                    reverse_sql="""
                    ALTER TABLE students_education
                    ALTER COLUMN start_year TYPE integer
                    USING EXTRACT(YEAR FROM start_year)::integer;
                    """,
                ),

                # Convert end_year: 2024 -> 2024-01-01
                migrations.RunSQL(
                    """
                    ALTER TABLE students_education
                    ALTER COLUMN end_year TYPE date
                    USING CASE
                        WHEN end_year IS NULL THEN NULL
                        ELSE make_date(end_year, 1, 1)
                    END;
                    """,
                    reverse_sql="""
                    ALTER TABLE students_education
                    ALTER COLUMN end_year TYPE integer
                    USING EXTRACT(YEAR FROM end_year)::integer;
                    """,
                ),
            ],

            state_operations=[
                migrations.AlterField(
                    model_name="education",
                    name="start_year",
                    field=models.DateField(),
                ),

                migrations.AlterField(
                    model_name="education",
                    name="end_year",
                    field=models.DateField(
                        blank=True,
                        null=True,
                    ),
                ),
            ],
        ),
    ]