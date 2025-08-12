CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Insert 10,000 dummy records
INSERT INTO "posts" ("title", "text", "created_at", "updated_at")
SELECT 
    'Post ' || generate_series(1, 10000) as title,
    'This is the content for post number ' || generate_series(1, 10000) || '. It contains some dummy text to fill the content field.' as text,
    now() - (random() * interval '365 days') as created_at,
    now() - (random() * interval '365 days') as updated_at
FROM generate_series(1, 10000);
