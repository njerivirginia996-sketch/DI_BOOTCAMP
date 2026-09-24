--
-- PostgreSQL database dump
--

\restrict zIXu8koFloUMmxMyowtiVoe1L9ADRSUWU9e47yvPQ9mGZflxVaLZ6apfkslBpFo

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-24 09:13:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16440)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    last_name character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    birth_date date NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16439)
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 219
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- TOC entry 4809 (class 2604 OID 16443)
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- TOC entry 4960 (class 0 OID 16440)
-- Dependencies: 220
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, last_name, first_name, birth_date) FROM stdin;
1	Benichou	Marc	1998-11-02
2	Cohen	Yoan	2010-12-03
3	Benichou	Lea	1987-07-27
4	Dux	Amelia	1996-04-07
5	Grez	David	2003-06-14
6	Simpson	Omer	1980-10-03
7	Benichou	Marc	1998-11-02
8	Cohen	Yoan	2010-12-03
9	Benichou	Lea	1987-07-27
10	Dux	Amelia	1996-04-07
11	Grez	David	2003-06-14
12	Simpson	Omer	1980-10-03
13	Benichou	Marc	1998-11-02
14	Cohen	Yoan	2010-12-03
15	Benichou	Lea	1987-07-27
16	Dux	Amelia	1996-04-07
17	Grez	David	2003-06-14
18	Simpson	Omer	1980-10-03
19	Benichou	Marc	1998-11-02
20	Cohen	Yoan	2010-12-03
21	Benichou	Lea	1987-07-27
22	Dux	Amelia	1996-04-07
23	Grez	David	2003-06-14
24	Simpson	Omer	1980-10-03
25	Njeri	Virginia	2006-10-28
26	Njeri	Virginia	2026-10-28
\.


--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 219
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 27, true);


--
-- TOC entry 4811 (class 2606 OID 16451)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


-- Completed on 2026-09-24 09:13:39

--
-- PostgreSQL database dump complete
--

\unrestrict zIXu8koFloUMmxMyowtiVoe1L9ADRSUWU9e47yvPQ9mGZflxVaLZ6apfkslBpFo

