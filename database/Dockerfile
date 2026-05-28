FROM postgres:17-alpine
COPY create_tables.sql /docker-entrypoint-initdb.d/1-create_tables.sql
COPY seed_vga.sql /docker-entrypoint-initdb.d/2-seed_vga.sql
