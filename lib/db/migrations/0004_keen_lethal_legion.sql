CREATE TYPE "public"."estado_noticia" AS ENUM('borrador', 'publicado');--> statement-breakpoint
CREATE TABLE "noticias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"contenido" text NOT NULL,
	"imagen_url" text,
	"estado" "estado_noticia" DEFAULT 'borrador' NOT NULL,
	"fondo_id" uuid,
	"publicado_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid
);
--> statement-breakpoint
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE cascade ON UPDATE no action;