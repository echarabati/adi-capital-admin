ALTER TABLE "fondos" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "proyectos" ADD COLUMN "codigo" text NOT NULL;--> statement-breakpoint
ALTER TABLE "proyectos" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "proyectos" ADD COLUMN "tasa_pref" numeric(5, 2) DEFAULT '12.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "proyectos" ADD COLUMN "fecha_inicio" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "proyectos" ADD COLUMN "fecha_terminacion" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_fondo_codigo_unique" UNIQUE("fondo_id","codigo");