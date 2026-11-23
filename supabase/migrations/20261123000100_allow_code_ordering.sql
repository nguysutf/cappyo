alter table public.exercises drop constraint if exists exercises_type_check;

alter table public.exercises add constraint exercises_type_check
  check (type in ('multiple-choice', 'text-completion', 'code-completion', 'code-writing', 'code-ordering'));