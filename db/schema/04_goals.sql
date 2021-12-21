-- goals table
create table goals (
    id bigint generated by default as identity primary key unique,
    created_at timestamp with time zone default now(),
    title varchar,
    description text,
    due_date date,
    owner_id uuid not null references profiles,
    contact_id bigint references contacts,
    is_completed boolean default false not null,
    outcome text,
    is_completed_on_time boolean default false not null,
    owner_name varchar
);