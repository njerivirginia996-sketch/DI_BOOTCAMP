--
-- PostgreSQL database dump
--

\restrict Pz1d2IiUQUcJgptOqRdjoYWSpB4fZus3iJnz4bVld5T7eRr5Xn5QgDGZJhSZjcL

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-29 15:48:06

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
-- TOC entry 222 (class 1259 OID 16519)
-- Name: hashpwd; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hashpwd (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.hashpwd OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16518)
-- Name: hashpwd_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hashpwd_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hashpwd_id_seq OWNER TO postgres;

--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 221
-- Name: hashpwd_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hashpwd_id_seq OWNED BY public.hashpwd.id;


--
-- TOC entry 4812 (class 2604 OID 16522)
-- Name: hashpwd id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashpwd ALTER COLUMN id SET DEFAULT nextval('public.hashpwd_id_seq'::regclass);


--
-- TOC entry 4965 (class 0 OID 16519)
-- Dependencies: 222
-- Data for Name: hashpwd; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashpwd (id, username, password) FROM stdin;
\.


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 221
-- Name: hashpwd_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hashpwd_id_seq', 1, false);


--
-- TOC entry 4814 (class 2606 OID 16529)
-- Name: hashpwd hashpwd_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashpwd
    ADD CONSTRAINT hashpwd_pkey PRIMARY KEY (id);


--
-- TOC entry 4816 (class 2606 OID 16531)
-- Name: hashpwd hashpwd_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashpwd
    ADD CONSTRAINT hashpwd_username_key UNIQUE (username);


-- Completed on 2026-09-29 15:48:06

--
-- PostgreSQL database dump complete
--

\unrestrict Pz1d2IiUQUcJgptOqRdjoYWSpB4fZus3iJnz4bVld5T7eRr5Xn5QgDGZJhSZjcL

