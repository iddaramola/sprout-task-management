CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(255) NOT NULL,

    description TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'Pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT tasks_title_not_empty
        CHECK (LENGTH(TRIM(title)) > 0),

    CONSTRAINT tasks_valid_status
        CHECK (
            status IN (
                'Pending',
                'In Progress',
                'Completed'
            )
        )
);

CREATE INDEX IF NOT EXISTS idx_tasks_status
ON tasks(status);