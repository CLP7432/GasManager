CREATE DATABASE  IF NOT EXISTS `gasmanager_users` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gasmanager_users`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gasmanager_users
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asistenteia`
--

DROP TABLE IF EXISTS `asistenteia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistenteia` (
  `id_asistente` int NOT NULL AUTO_INCREMENT,
  `contexto_actual` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `modeloia` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_asistente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistenteia`
--

LOCK TABLES `asistenteia` WRITE;
/*!40000 ALTER TABLE `asistenteia` DISABLE KEYS */;
/*!40000 ALTER TABLE `asistenteia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistenteia_historia_conversacion`
--

DROP TABLE IF EXISTS `asistenteia_historia_conversacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistenteia_historia_conversacion` (
  `asistenteia_id_asistente` int NOT NULL,
  `historia_conversacion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  KEY `FK9fd9j9wrvubvhqssjejmlhnrt` (`asistenteia_id_asistente`),
  CONSTRAINT `FK9fd9j9wrvubvhqssjejmlhnrt` FOREIGN KEY (`asistenteia_id_asistente`) REFERENCES `asistenteia` (`id_asistente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistenteia_historia_conversacion`
--

LOCK TABLES `asistenteia_historia_conversacion` WRITE;
/*!40000 ALTER TABLE `asistenteia_historia_conversacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `asistenteia_historia_conversacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria_accion`
--

DROP TABLE IF EXISTS `auditoria_accion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_accion` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `id_usuario_ejecutor` int DEFAULT NULL,
  `fecha_hora` datetime(6) DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `modulo_afectado` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `origen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `datos_anteriores` tinytext COLLATE utf8mb4_general_ci,
  `datos_nuevos` tinytext COLLATE utf8mb4_general_ci,
  `tipo_accion` enum('CREAR','LEER','ACTUALIZAR','VALIDAR','ELIMINAR') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo_acccion` enum('CREAR','LEER','ACTUALIZAR','VALIDAR','ELIMINAR') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_auditoria`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_accion`
--

LOCK TABLES `auditoria_accion` WRITE;
/*!40000 ALTER TABLE `auditoria_accion` DISABLE KEYS */;
INSERT INTO `auditoria_accion` VALUES (1,1,'2026-03-10 09:58:34.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T09:58:34.529447700\"}','VALIDAR',NULL),(2,1,'2026-03-10 09:58:34.000000','Login fallido _ Intento #1','Login','WEB','{\"intentosFallidos\":0}','{\"intentosFallidos\":1}','VALIDAR',NULL),(3,1,'2026-03-10 09:59:16.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T09:59:16.206358300\"}','VALIDAR',NULL),(4,1,'2026-03-10 09:59:16.000000','Login fallido _ Intento #2','Login','WEB','{\"intentosFallidos\":1}','{\"intentosFallidos\":2}','VALIDAR',NULL),(5,1,'2026-03-10 10:00:11.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:00:11.979804800\"}','VALIDAR',NULL),(6,1,'2026-03-10 10:00:12.000000','USUARIO BLOQUEADO - 3 intentos fallidos - Requiere restablecimiento de contraseña','Login','WEB','{\"intentosFallidos\":2,\"bloqueado\":false}','{\"intentosFallidos\":3,\"bloqueado\":true,\"estado\":\"BLOQUEADO\",\"requiereResetPassword\":true}','VALIDAR',NULL),(7,1,'2026-03-10 10:04:15.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:04:15.882048500\"}','VALIDAR',NULL),(8,1,'2026-03-10 10:04:15.000000','Login fallido _ Intento #1','Login','WEB','{\"intentosFallidos\":0}','{\"intentosFallidos\":1}','VALIDAR',NULL),(9,1,'2026-03-10 10:07:41.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:07:41.017575500\"}','VALIDAR',NULL),(10,1,'2026-03-10 10:07:41.000000','Login fallido _ Intento #2','Login','WEB','{\"intentosFallidos\":1}','{\"intentosFallidos\":2}','VALIDAR',NULL),(11,1,'2026-03-10 10:10:22.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:10:22.399834700\"}','VALIDAR',NULL),(12,1,'2026-03-10 10:10:22.000000','Login fallido _ Intento #1','Login','WEB','{\"intentosFallidos\":0}','{\"intentosFallidos\":1}','VALIDAR',NULL),(13,1,'2026-03-10 10:11:23.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:11:23.058648\"}','VALIDAR',NULL),(14,1,'2026-03-10 10:11:23.000000','Login fallido _ Intento #2','Login','WEB','{\"intentosFallidos\":1}','{\"intentosFallidos\":2}','VALIDAR',NULL),(15,1,'2026-03-10 10:16:44.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:16:44.706976200\"}','VALIDAR',NULL),(16,1,'2026-03-10 10:16:44.000000','USUARIO BLOQUEADO - 3 intentos fallidos - Requiere restablecimiento de contraseña','Login','WEB','{\"intentosFallidos\":2,\"bloqueado\":false}','{\"intentosFallidos\":3,\"bloqueado\":true,\"estado\":\"BLOQUEADO\",\"requiereResetPassword\":true}','VALIDAR',NULL),(17,1,'2026-03-10 10:22:36.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:22:36.054017300\"}','VALIDAR',NULL),(18,1,'2026-03-10 10:22:36.000000','Login fallido _ Intento #1','Login','WEB','{\"intentosFallidos\":0}','{\"intentosFallidos\":1}','VALIDAR',NULL),(19,1,'2026-03-10 10:24:04.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:24:04.318111\"}','VALIDAR',NULL),(20,1,'2026-03-10 10:24:04.000000','Login fallido _ Intento #2','Login','WEB','{\"intentosFallidos\":1}','{\"intentosFallidos\":2}','VALIDAR',NULL),(21,1,'2026-03-10 10:26:52.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:26:52.552603200\"}','VALIDAR',NULL),(22,1,'2026-03-10 10:26:52.000000','Login fallido _ Intento #1','Login','WEB','{\"intentosFallidos\":0}','{\"intentosFallidos\":1}','VALIDAR',NULL),(23,1,'2026-03-10 10:33:33.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T10:33:33.658504400\"}','VALIDAR',NULL),(24,1,'2026-03-10 10:33:33.000000','Login fallido - Intento #1','Login','WEB','{\"intentosFallidos\":0}','{\"intentosFallidos\":1}','VALIDAR',NULL),(25,1,'2026-03-10 11:06:58.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:06:58.984745600\"}','VALIDAR',NULL),(26,1,'2026-03-10 11:06:59.000000','Login fallido - Intento #2','Login','WEB','{\"intentosFallidos\":1}','{\"intentosFallidos\":2}','VALIDAR',NULL),(27,1,'2026-03-10 11:08:29.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:08:29.959414\"}','VALIDAR',NULL),(28,1,'2026-03-10 11:08:30.000000','USUARIO BLOQUEADO - 3 intentos fallidos - Requiere restablecimiento de contraseña','Login','WEB','{\"intentosFallidos\":2,\"bloqueado\":false}','{\"intentosFallidos\":3,\"bloqueado\":true,\"estado\":\"BLOQUEADO\",\"requiereResetPassword\":true}','VALIDAR',NULL),(29,1,'2026-03-10 11:10:25.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:10:25.293702800\"}','VALIDAR',NULL),(30,1,'2026-03-10 11:10:25.000000','Login fallido - Intento #1','Login','WEB','{\"intentosFallidos\":0}','{\"intentosFallidos\":1}','VALIDAR',NULL),(31,1,'2026-03-10 11:14:56.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:14:56.042560600\"}','VALIDAR',NULL),(32,1,'2026-03-10 11:14:56.000000','Login fallido - Intento #1','Login','WEB','{\"intentosFallidos\":0}','{\"intentosFallidos\":1}','VALIDAR',NULL),(33,1,'2026-03-10 11:15:53.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:15:53.933036700\"}','VALIDAR',NULL),(34,1,'2026-03-10 11:15:54.000000','Login fallido - Intento #2','Login','WEB','{\"intentosFallidos\":1}','{\"intentosFallidos\":2}','VALIDAR',NULL),(35,1,'2026-03-10 11:16:57.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:16:57.205186800\"}','VALIDAR',NULL),(36,1,'2026-03-10 11:16:57.000000','USUARIO BLOQUEADO - 3 intentos fallidos - Requiere restablecimiento de contraseña','Login','WEB','{\"intentosFallidos\":2,\"bloqueado\":false}','{\"intentosFallidos\":3,\"bloqueado\":true,\"estado\":\"BLOQUEADO\",\"requiereResetPassword\":true}','VALIDAR',NULL),(37,1,'2026-03-10 11:19:18.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:19:18.841107700\"}','VALIDAR',NULL),(38,1,'2026-03-10 11:19:19.000000','Login exitoso - Acceso concedido','Login','WEB','{\"intentosFallidos\":0}','{\"ultimoAcceso\":\"2026-03-10T11:19:19.092130700\",\"rol\":\"ROLE_ADMIN\",\"intentosReseteados\":true}','VALIDAR',NULL),(39,1,'2026-03-10 11:20:16.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:20:16.111798400\"}','VALIDAR',NULL),(40,1,'2026-03-10 11:20:16.000000','Login exitoso - Acceso concedido','Login','WEB','{\"intentosFallidos\":0}','{\"ultimoAcceso\":\"2026-03-10T11:20:16.369489700\",\"rol\":\"ROLE_ADMIN\",\"intentosReseteados\":true}','VALIDAR',NULL),(41,1,'2026-03-10 11:37:21.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:37:21.385513\"}','VALIDAR',NULL),(42,1,'2026-03-10 11:37:21.000000','Login exitoso - Acceso concedido','Login','WEB','{\"intentosFallidos\":0}','{\"ultimoAcceso\":\"2026-03-10T11:37:21.636874600\",\"rol\":\"ROLE_ADMIN\",\"intentosReseteados\":true}','VALIDAR',NULL),(43,1,'2026-03-10 11:38:52.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T11:38:52.179189700\"}','VALIDAR',NULL),(44,1,'2026-03-10 11:38:52.000000','Login exitoso - Acceso concedido','Login','WEB','{\"intentosFallidos\":0}','{\"ultimoAcceso\":\"2026-03-10T11:38:52.439855100\",\"rol\":\"ROLE_ADMIN\",\"intentosReseteados\":true}','VALIDAR',NULL),(45,1,'2026-03-10 15:15:10.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T15:15:10.649846800\"}','VALIDAR',NULL),(46,1,'2026-03-10 15:15:10.000000','Login exitoso - Acceso concedido','Login','WEB','{\"intentosFallidos\":0}','{\"ultimoAcceso\":\"2026-03-10T15:15:10.926815300\",\"rol\":\"ADMINISTRADOR\",\"intentosReseteados\":true}','VALIDAR',NULL),(47,2,'2026-03-10 15:16:40.000000','Usuario creado exitosamente','Usuarios','Sistema',NULL,'{\"nombre\":\"Marco\",\"correo\":\"marco@example.com\",\"rol\":\"null\"}','CREAR',NULL),(48,2,'2026-03-10 15:17:10.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"marco@example.com\",\"hora\":\"2026-03-10T15:17:10.472062300\"}','VALIDAR',NULL),(49,2,'2026-03-10 15:17:10.000000','Login exitoso - Acceso concedido','Login','WEB','{\"intentosFallidos\":0}','{\"ultimoAcceso\":\"2026-03-10T15:17:10.540174800\",\"rol\":\"ROLE_ADMIN\",\"intentosReseteados\":true}','VALIDAR',NULL),(50,1,'2026-03-10 22:16:39.000000','Intento de acceso al sistema','Login','Web',NULL,'{\"correo\":\"admin@gasmanager.com\",\"hora\":\"2026-03-10T22:16:39.965342\"}','VALIDAR',NULL),(51,1,'2026-03-10 22:16:40.000000','Login exitoso - Acceso concedido','Login','WEB','{\"intentosFallidos\":0}','{\"ultimoAcceso\":\"2026-03-10T22:16:40.235100800\",\"rol\":\"ADMINISTRADOR\",\"intentosReseteados\":true}','VALIDAR',NULL);
/*!40000 ALTER TABLE `auditoria_accion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id_token` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `usado` bit(1) NOT NULL,
  `fecha_expiracion` datetime(6) NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_token`),
  UNIQUE KEY `UK_johu5tq9i7cy1fgyemmlme0p2` (`id_usuario`),
  UNIQUE KEY `UK_g0guo4k8krgpwuagos61oc06j` (`token`),
  CONSTRAINT `FKno4ngi2ecktio49ytrq5d2cxh` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_token`
--

LOCK TABLES `password_reset_token` WRITE;
/*!40000 ALTER TABLE `password_reset_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso` (
  `activo` bit(1) DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `codigo_permiso` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre_permiso` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `UK_rvbnkgjp2581y1hndb2sqyx5g` (`codigo_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES (_binary '','2026-03-10 00:00:00.000000',1,'CREAR_USUARIO','Permite crear nuevos usuarios','Crear Usuario'),(_binary '','2026-03-10 00:00:00.000000',2,'LEER_USUARIO','Permite ver usuarios','Leer Usuario'),(_binary '','2026-03-10 00:00:00.000000',3,'ACTUALIZAR_USUARIO','Permite modificar usuarios','Actualizar Usuario'),(_binary '','2026-03-10 00:00:00.000000',4,'ELIMINAR_USUARIO','Permite eliminar usuarios','Eliminar Usuario'),(_binary '','2026-03-10 00:00:00.000000',5,'CREAR_ROL','Permite crear roles','Crear Rol'),(_binary '','2026-03-10 00:00:00.000000',6,'LEER_ROL','Permite ver roles','Leer Rol'),(_binary '','2026-03-10 00:00:00.000000',7,'ACTUALIZAR_ROL','Permite modificar roles','Actualizar Rol'),(_binary '','2026-03-10 00:00:00.000000',8,'ELIMINAR_ROL','Permite eliminar roles','Eliminar Rol'),(_binary '','2026-03-10 00:00:00.000000',9,'CREAR_PERMISO','Permite crear permisos','Crear Permiso'),(_binary '','2026-03-10 00:00:00.000000',10,'LEER_PERMISO','Permite ver permisos','Leer Permiso'),(_binary '','2026-03-10 00:00:00.000000',11,'ACTUALIZAR_PERMISO','Permite modificar permisos','Actualizar Permiso'),(_binary '','2026-03-10 00:00:00.000000',12,'ELIMINAR_PERMISO','Permite eliminar permisos','Eliminar Permiso'),(_binary '','2026-03-10 00:00:00.000000',13,'GESTIONAR_SESIONES','Permite ver y cerrar sesiones','Gestionar Sesiones'),(_binary '','2026-03-10 00:00:00.000000',14,'VER_AUDITORIA','Permite ver logs de auditoría','Ver Auditoría');
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `activo` bit(1) DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre_rol` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `UK_l0qdsam7tunbtmxcmeeyfcifk` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (_binary '','2026-03-10 00:00:00.000000',1,'Administrador del sistema con todos los permisos','ROLE_ADMIN'),(_binary '','2026-03-10 00:00:00.000000',2,'Supervisor de operaciones','SUPERVISOR'),(_binary '','2026-03-10 00:00:00.000000',3,'Despachador de ventas','DESPACHADOR'),(_binary '','2026-03-10 00:00:00.000000',4,'Contador y finanzas','CONTADOR'),(_binary '','2026-03-10 00:00:00.000000',5,'Administrador del sistema (legado)','ADMINISTRADOR');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_permisos`
--

DROP TABLE IF EXISTS `roles_permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_permisos` (
  `id_permiso` int NOT NULL,
  `id_rol` int NOT NULL,
  PRIMARY KEY (`id_permiso`,`id_rol`),
  KEY `FKode9508gq58igyq0crn5xp75b` (`id_rol`),
  CONSTRAINT `FK9rnwty0nf6dley4emnr6lk175` FOREIGN KEY (`id_permiso`) REFERENCES `permiso` (`id_permiso`),
  CONSTRAINT `FKode9508gq58igyq0crn5xp75b` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_permisos`
--

LOCK TABLES `roles_permisos` WRITE;
/*!40000 ALTER TABLE `roles_permisos` DISABLE KEYS */;
INSERT INTO `roles_permisos` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(1,5),(2,5),(3,5),(4,5),(5,5),(6,5),(7,5),(8,5),(9,5),(10,5),(11,5),(12,5),(13,5),(14,5);
/*!40000 ALTER TABLE `roles_permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sesion_usuario`
--

DROP TABLE IF EXISTS `sesion_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sesion_usuario` (
  `activo` bit(1) DEFAULT NULL,
  `id_sesion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fecha_expiracion` datetime(6) DEFAULT NULL,
  `fecha_inicio` datetime(6) DEFAULT NULL,
  `ultima_actividad` datetime(6) DEFAULT NULL,
  `origen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_sesion`),
  UNIQUE KEY `UK_tc95lwuhv8smqio6jxuim8vr1` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesion_usuario`
--

LOCK TABLES `sesion_usuario` WRITE;
/*!40000 ALTER TABLE `sesion_usuario` DISABLE KEYS */;
INSERT INTO `sesion_usuario` VALUES (_binary '',1,1,'2026-03-10 13:19:19.000000','2026-03-10 11:19:19.000000',NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnYXNtYW5hZ2VyLmNvbSIsImlkVXN1YXJpbyI6MSwicm9sIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc3MzE2MzE1OSwiZXhwIjoxNzczMTY2NzU5fQ.rwpoBJcRW7ykdJsPpu1Yu8sA75uJATRE4jTgL57JoCg'),(_binary '',2,1,'2026-03-10 13:20:16.000000','2026-03-10 11:20:16.000000',NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnYXNtYW5hZ2VyLmNvbSIsImlkVXN1YXJpbyI6MSwicm9sIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc3MzE2MzIxNiwiZXhwIjoxNzczMTY2ODE2fQ.xdcMTAn7oZ8wBbdY9OHQ2n9vKPDUeFsvf3nh6_p1a4Q'),(_binary '',3,1,'2026-03-10 13:37:21.000000','2026-03-10 11:37:21.000000',NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnYXNtYW5hZ2VyLmNvbSIsImlkVXN1YXJpbyI6MSwicm9sIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc3MzE2NDI0MSwiZXhwIjoxNzczMTY3ODQxfQ.dTx4SQvoikxWtYRj0xcKf2xjLilDL2L6etVTYnEbPp0'),(_binary '',4,1,'2026-03-10 13:38:52.000000','2026-03-10 11:38:52.000000',NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnYXNtYW5hZ2VyLmNvbSIsImlkVXN1YXJpbyI6MSwicm9sIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc3MzE2NDMzMiwiZXhwIjoxNzczMTY3OTMyfQ.mBs3XOAZh8x0SodOOjlf0JsEElpOsRzcwJC2zeRXyns'),(_binary '',5,1,'2026-03-10 17:15:10.000000','2026-03-10 15:15:10.000000',NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnYXNtYW5hZ2VyLmNvbSIsImlkVXN1YXJpbyI6MSwicm9sIjoiQURNSU5JU1RSQURPUiIsImlhdCI6MTc3MzE3NzMxMCwiZXhwIjoxNzczMTgwOTEwfQ.p5N07GcfRpOCZV9yzXAHJM6DOZ_3Tdg-50OOtXLz2X8'),(_binary '',6,2,'2026-03-10 17:17:10.000000','2026-03-10 15:17:10.000000',NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJjb0BleGFtcGxlLmNvbSIsImlkVXN1YXJpbyI6Miwicm9sIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc3MzE3NzQzMCwiZXhwIjoxNzczMTgxMDMwfQ.jWDJ0nItV0hSJohweEb11IhAVmiM2pvu3_-hUxsH0bo'),(_binary '',7,1,'2026-03-11 00:16:40.000000','2026-03-10 22:16:40.000000',NULL,NULL,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnYXNtYW5hZ2VyLmNvbSIsImlkVXN1YXJpbyI6MSwicm9sIjoiQURNSU5JU1RSQURPUiIsImlhdCI6MTc3MzIwMjYwMCwiZXhwIjoxNzczMjA2MjAwfQ.6j76QRCYp8SJXqNQAJPNBQl9f5m_t-6wcxLYeoJiJPg');
/*!40000 ALTER TABLE `sesion_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `activo` bit(1) DEFAULT NULL,
  `bloqueado` bit(1) DEFAULT NULL,
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `intentos_fallidos` int DEFAULT NULL,
  `rol_id` int DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `ultimo_acceso` datetime(6) DEFAULT NULL,
  `correo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` enum('ACTIVO','INACTIVO','BLOQUEADO','SUSPENDIDO') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `UK_2mlfr087gb1ce55f2j87o74t` (`correo`),
  KEY `FKshkwj12wg6vkm6iuwhvcfpct8` (`rol_id`),
  CONSTRAINT `FKshkwj12wg6vkm6iuwhvcfpct8` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (_binary '',_binary '\0',1,0,5,'2026-03-10 09:56:59.000000','2026-03-10 22:16:40.000000','admin@gasmanager.com','Administrador','$2a$12$h70hBzhnTcQDBH248hdgze0sKPt130q9hAI80FJb0HkQmyigVkHLy','ACTIVO'),(_binary '',_binary '\0',2,0,1,'2026-03-10 15:16:40.000000','2026-03-10 15:17:10.000000','marco@example.com','Marco','$2a$10$.3wD2umm44IuSjSmHf8mduphFi.fLpLZzmgPnqwzUBDYWXCCQgYXW','ACTIVO');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-18 10:44:15
CREATE DATABASE  IF NOT EXISTS `gasmanager_reportes` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gasmanager_reportes`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gasmanager_reportes
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-18 10:44:15
CREATE DATABASE  IF NOT EXISTS `gasmanager_clientes` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gasmanager_clientes`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gasmanager_clientes
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `abonos_credito`
--

DROP TABLE IF EXISTS `abonos_credito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `abonos_credito` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `fecha_abono` date NOT NULL,
  `folio_abono` varchar(30) NOT NULL,
  `metodo_pago` varchar(20) DEFAULT NULL,
  `monto` decimal(12,2) NOT NULL,
  `notas` text,
  `referencia_pago` varchar(50) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `credito_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK5qn1kw87kh15he2iv7gmdrgnc` (`folio_abono`),
  KEY `FKhq4pbbp9ox79xn4c9fy4mwlb4` (`credito_id`),
  CONSTRAINT `FKhq4pbbp9ox79xn4c9fy4mwlb4` FOREIGN KEY (`credito_id`) REFERENCES `creditos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abonos_credito`
--

LOCK TABLES `abonos_credito` WRITE;
/*!40000 ALTER TABLE `abonos_credito` DISABLE KEYS */;
INSERT INTO `abonos_credito` VALUES (1,'2026-06-17 07:24:21.547479','SISTEMA','2026-06-17','ABONO-20260617072421-0001','EFECTIVO',1000.00,NULL,NULL,'2026-06-17 07:24:21.547479','SISTEMA',0,1);
/*!40000 ALTER TABLE `abonos_credito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `calle` varchar(100) DEFAULT NULL,
  `celular` varchar(15) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `codigo_cliente` varchar(50) NOT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `colonia` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `curp` varchar(18) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `nombre_comercial` varchar(255) DEFAULT NULL,
  `numero_exterior` varchar(20) DEFAULT NULL,
  `numero_interior` varchar(20) DEFAULT NULL,
  `razon_social` varchar(150) DEFAULT NULL,
  `rfc` varchar(13) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `tipo_persona` enum('FISICA','MORAL') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8gduvo4bbw5hhyyivmrmdonau` (`codigo_cliente`),
  UNIQUE KEY `UKput0r7uw2ww6awlkw8srv4ydb` (`rfc`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,_binary '','calle 37 Avenidas','2711868706','Cordoba Veracruz','CLI-20260617072336-0001','94680','La sidra','2026-06-17 07:23:36.334935','SISTEMA',NULL,'clp7432@gmail.com','Veracruz','Marco','5',NULL,'Carrasco Hernandez','PEGJ900101ABC',NULL,'FISICA','2026-06-17 07:23:36.335934','SISTEMA',0);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creditos`
--

DROP TABLE IF EXISTS `creditos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creditos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `dia_pago` int DEFAULT NULL,
  `estado` enum('ACTIVO','CANCELADO','EN_COBRANZA','PAGADO','VENCIDO') NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_ultimo_pago` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `folio_credito` varchar(30) NOT NULL,
  `metodo_pago` enum('MENSUAL','PERSONALIZADO','QUINCENAL','SEMANAL') DEFAULT NULL,
  `monto_interes` decimal(12,2) DEFAULT NULL,
  `monto_pagado` decimal(12,2) DEFAULT NULL,
  `monto_total` decimal(12,2) NOT NULL,
  `notas` text,
  `plazo_meses` int DEFAULT NULL,
  `saldo_pendiente` decimal(12,2) DEFAULT NULL,
  `tasa_interes` decimal(5,2) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `cliente_id` bigint NOT NULL,
  `dias_mora` int DEFAULT NULL,
  `fecha_ultimo_calculo_interes` date DEFAULT NULL,
  `monto_interes_acumulado` decimal(12,2) DEFAULT NULL,
  `monto_mora_acumulado` decimal(12,2) DEFAULT NULL,
  `tasa_mora` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKojnyi3ywl3f9uhhe4y3bg9clg` (`folio_credito`),
  KEY `FKebytgljwj03rs91cbtjvc3cdk` (`cliente_id`),
  CONSTRAINT `FKebytgljwj03rs91cbtjvc3cdk` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creditos`
--

LOCK TABLES `creditos` WRITE;
/*!40000 ALTER TABLE `creditos` DISABLE KEYS */;
INSERT INTO `creditos` VALUES (1,'2026-06-17 07:24:04.551248','SISTEMA',1,'ACTIVO','2026-06-17','2026-06-17','2026-07-17','CRED-20260617072404-0001','MENSUAL',0.00,1000.00,12000.00,NULL,1,11000.00,0.06,'2026-06-17 07:24:21.553476','SISTEMA',1,1,0,'2026-06-17',0.00,0.00,1.00);
/*!40000 ALTER TABLE `creditos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-18 10:44:16
CREATE DATABASE  IF NOT EXISTS `gasmanager_inventarios` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gasmanager_inventarios`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gasmanager_inventarios
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aceites`
--

DROP TABLE IF EXISTS `aceites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aceites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `codigo` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio_compra` decimal(10,2) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `presentacion` varchar(20) DEFAULT NULL,
  `stock_actual` int NOT NULL,
  `stock_maximo` int NOT NULL,
  `stock_minimo` int NOT NULL,
  `tipo_aceite` varchar(30) DEFAULT NULL,
  `ubicacion` varchar(50) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKny00yqmlmg8u3o1xm2t9wjdsd` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aceites`
--

LOCK TABLES `aceites` WRITE;
/*!40000 ALTER TABLE `aceites` DISABLE KEYS */;
INSERT INTO `aceites` VALUES (2,_binary '','ACE-001','2026-06-24 06:09:13.000000',NULL,NULL,'Castrol','Aceite 5W-30 Sintético',220.00,300.00,'1L',0,100,10,'Sintético',NULL,'2026-07-01 20:35:06.377047','sistema'),(3,_binary '','ACE-002','2026-06-24 06:09:13.000000',NULL,NULL,'Mobil 1','Aceite 5W-30 Sintético',250.00,280.00,'1L',0,100,10,'Sintético',NULL,'2026-06-24 06:09:13.000000',NULL),(4,_binary '','ACE-003','2026-06-24 06:09:13.000000',NULL,NULL,'Shell Helix','Aceite 5W-30 Sintético',230.00,260.00,'1L',0,100,10,'Sintético',NULL,'2026-06-24 06:09:13.000000',NULL),(5,_binary '','ACE-004','2026-06-24 06:09:13.000000',NULL,NULL,'Castrol','Aceite 5W-40 Sintético',240.00,270.00,'1L',0,100,10,'Sintético',NULL,'2026-06-24 06:09:13.000000',NULL),(6,_binary '','ACE-005','2026-06-24 06:09:13.000000',NULL,NULL,'Mobil 1','Aceite 5W-40 Sintético',270.00,300.00,'1L',0,100,10,'Sintético',NULL,'2026-06-24 06:09:13.000000',NULL),(7,_binary '','ACE-006','2026-06-24 06:09:13.000000',NULL,NULL,'Castrol','Aceite 10W-40 Semisintético',155.00,180.00,'1L',0,120,15,'Semisintético',NULL,'2026-06-24 06:09:13.000000',NULL),(8,_binary '','ACE-007','2026-06-24 06:09:13.000000',NULL,NULL,'Shell Helix','Aceite 10W-40 Semisintético',165.00,190.00,'1L',0,120,15,'Semisintético',NULL,'2026-06-24 06:09:13.000000',NULL),(9,_binary '','ACE-008','2026-06-24 06:09:13.000000',NULL,NULL,'Pennzoil','Aceite 10W-40 Semisintético',145.00,170.00,'1L',0,120,15,'Semisintético',NULL,'2026-06-24 06:09:13.000000',NULL),(10,_binary '','ACE-009','2026-06-24 06:09:13.000000',NULL,NULL,'Castrol','Aceite 20W-50 Mineral',95.00,120.00,'1L',0,80,10,'Mineral',NULL,'2026-06-24 06:09:13.000000',NULL),(11,_binary '','ACE-010','2026-06-24 06:09:13.000000',NULL,NULL,'Shell Helix','Aceite 20W-50 Mineral',100.00,125.00,'1L',0,80,10,'Mineral',NULL,'2026-06-24 06:09:13.000000',NULL),(12,_binary '','ACE-011','2026-06-24 06:09:13.000000',NULL,NULL,'Shell Rotella','Aceite 15W-40 Diésel',130.00,160.00,'1L',0,80,10,'Mineral',NULL,'2026-06-24 06:09:13.000000',NULL),(13,_binary '','ACE-012','2026-06-24 06:09:13.000000',NULL,NULL,'Mobil Delvac','Aceite 15W-40 Diésel',125.00,155.00,'1L',0,80,10,'Mineral',NULL,'2026-06-24 06:09:13.000000',NULL),(14,_binary '','ACE-013','2026-06-24 06:09:13.000000',NULL,NULL,'Castrol Vecton','Aceite 10W-40 Diésel Sintético',190.00,220.00,'1L',0,50,5,'Sintético',NULL,'2026-06-24 06:09:13.000000',NULL),(15,_binary '','ACE-014','2026-06-24 06:09:13.000000',NULL,NULL,'Castrol','Aceite 80W-90 Transmisión',150.00,180.00,'1L',0,40,5,'Mineral',NULL,'2026-06-24 06:09:13.000000',NULL),(16,_binary '','ACE-015','2026-06-24 06:09:13.000000',NULL,NULL,'Mobil ATF','Aceite ATF Automático',170.00,200.00,'1L',0,40,5,'Sintético',NULL,'2026-06-24 06:09:13.000000',NULL),(17,_binary '','ACE-016','2026-06-24 06:09:13.000000',NULL,NULL,'Shell Spirax','Aceite 85W-140 Diferencial',180.00,210.00,'1L',0,30,3,'Mineral',NULL,'2026-06-24 06:09:13.000000',NULL),(18,_binary '','ACE-017','2026-06-24 06:09:13.000000',NULL,NULL,'STP','Aditivo Limpiador de Inyectores',65.00,90.00,'355 ml',0,50,10,'Aditivo',NULL,'2026-06-24 06:09:13.000000',NULL),(19,_binary '','ACE-018','2026-06-24 06:09:13.000000',NULL,NULL,'STP','Aditivo para Tanque de Gasolina',55.00,80.00,'355 ml',0,50,10,'Aditivo',NULL,'2026-06-24 06:09:13.000000',NULL),(20,_binary '','ACE-019','2026-06-24 06:09:13.000000',NULL,NULL,'STP','Aditivo Limpiador de Motor',60.00,85.00,'355 ml',0,50,10,'Aditivo',NULL,'2026-06-24 06:09:13.000000',NULL);
/*!40000 ALTER TABLE `aceites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aceites_bodega`
--

DROP TABLE IF EXISTS `aceites_bodega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aceites_bodega` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aceite_id` bigint NOT NULL,
  `codigo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock_actual` int NOT NULL DEFAULT '0',
  `stock_minimo` int NOT NULL DEFAULT '5',
  `stock_maximo` int NOT NULL DEFAULT '100',
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `proveedor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ubicacion` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_aceite_id` (`aceite_id`),
  CONSTRAINT `aceites_bodega_ibfk_1` FOREIGN KEY (`aceite_id`) REFERENCES `aceites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aceites_bodega`
--

LOCK TABLES `aceites_bodega` WRITE;
/*!40000 ALTER TABLE `aceites_bodega` DISABLE KEYS */;
INSERT INTO `aceites_bodega` VALUES (1,2,'ACE-001','Aceite 5W-30 Sintético',0,5,100,220.00,250.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(2,3,'ACE-002','Aceite 5W-30 Sintético',0,5,100,250.00,280.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(3,4,'ACE-003','Aceite 5W-30 Sintético',0,5,100,230.00,260.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(4,5,'ACE-004','Aceite 5W-40 Sintético',0,5,100,240.00,270.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(5,6,'ACE-005','Aceite 5W-40 Sintético',0,5,100,270.00,300.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(6,7,'ACE-006','Aceite 10W-40 Semisintético',0,5,100,155.00,180.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(7,8,'ACE-007','Aceite 10W-40 Semisintético',0,5,100,165.00,190.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(8,9,'ACE-008','Aceite 10W-40 Semisintético',0,5,100,145.00,170.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(9,10,'ACE-009','Aceite 20W-50 Mineral',0,5,100,95.00,120.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(10,11,'ACE-010','Aceite 20W-50 Mineral',0,5,100,100.00,125.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(11,12,'ACE-011','Aceite 15W-40 Diésel',0,5,100,130.00,160.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(12,13,'ACE-012','Aceite 15W-40 Diésel',0,5,100,125.00,155.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(13,14,'ACE-013','Aceite 10W-40 Diésel Sintético',0,5,100,190.00,220.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(14,15,'ACE-014','Aceite 80W-90 Transmisión',0,5,100,150.00,180.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(15,16,'ACE-015','Aceite ATF Automático',0,5,100,170.00,200.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(16,17,'ACE-016','Aceite 85W-140 Diferencial',0,5,100,180.00,210.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(17,18,'ACE-017','Aditivo Limpiador de Inyectores',0,5,100,65.00,90.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(18,19,'ACE-018','Aditivo para Tanque de Gasolina',0,5,100,55.00,80.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema'),(19,20,'ACE-019','Aditivo Limpiador de Motor',0,5,100,60.00,85.00,NULL,NULL,1,'2026-06-24 10:46:54','2026-06-24 13:23:59','admin','sistema');
/*!40000 ALTER TABLE `aceites_bodega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aceites_dispensario`
--

DROP TABLE IF EXISTS `aceites_dispensario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aceites_dispensario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dispensario_id` bigint NOT NULL,
  `aceite_id` bigint NOT NULL,
  `codigo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock_actual` int NOT NULL DEFAULT '0',
  `stock_minimo` int NOT NULL DEFAULT '2',
  `stock_maximo` int NOT NULL DEFAULT '20',
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dispensario_aceite` (`dispensario_id`,`aceite_id`),
  KEY `aceite_id` (`aceite_id`),
  CONSTRAINT `aceites_dispensario_ibfk_1` FOREIGN KEY (`aceite_id`) REFERENCES `aceites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aceites_dispensario`
--

LOCK TABLES `aceites_dispensario` WRITE;
/*!40000 ALTER TABLE `aceites_dispensario` DISABLE KEYS */;
INSERT INTO `aceites_dispensario` VALUES (1,19,2,'ACE-001','Aceite 5W-30 Sintético',0,2,20,250.00,1,'2026-06-24 10:47:03','2026-06-24 13:23:59','admin','sistema',NULL),(2,19,3,'ACE-002','Aceite 5W-30 Sintético',0,2,20,280.00,1,'2026-06-24 10:47:03','2026-06-24 13:23:59','admin','sistema',NULL),(3,19,4,'ACE-003','Aceite 5W-30 Sintético',0,2,20,260.00,1,'2026-06-24 10:47:03','2026-06-24 13:23:59','admin','sistema',NULL),(4,19,5,'ACE-004','Aceite 5W-40 Sintético',0,2,20,270.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(5,19,6,'ACE-005','Aceite 5W-40 Sintético',0,2,20,300.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(6,19,7,'ACE-006','Aceite 10W-40 Semisintético',0,2,20,180.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(7,19,8,'ACE-007','Aceite 10W-40 Semisintético',0,2,20,190.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(8,19,9,'ACE-008','Aceite 10W-40 Semisintético',0,2,20,170.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(9,19,10,'ACE-009','Aceite 20W-50 Mineral',0,2,20,120.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(10,19,11,'ACE-010','Aceite 20W-50 Mineral',0,2,20,125.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(11,19,12,'ACE-011','Aceite 15W-40 Diésel',0,2,20,160.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(12,19,13,'ACE-012','Aceite 15W-40 Diésel',0,2,20,155.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(13,19,14,'ACE-013','Aceite 10W-40 Diésel Sintético',0,2,20,220.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(14,19,15,'ACE-014','Aceite 80W-90 Transmisión',0,2,20,180.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(15,19,16,'ACE-015','Aceite ATF Automático',0,2,20,200.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(16,19,17,'ACE-016','Aceite 85W-140 Diferencial',0,2,20,210.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(17,19,18,'ACE-017','Aditivo Limpiador de Inyectores',0,2,20,90.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(18,19,19,'ACE-018','Aditivo para Tanque de Gasolina',0,2,20,80.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(19,19,20,'ACE-019','Aditivo Limpiador de Motor',0,2,20,85.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(32,20,2,'ACE-001','Aceite 5W-30 Sintético',0,2,20,250.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(33,20,3,'ACE-002','Aceite 5W-30 Sintético',0,2,20,280.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(34,20,4,'ACE-003','Aceite 5W-30 Sintético',0,2,20,260.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(35,20,5,'ACE-004','Aceite 5W-40 Sintético',0,2,20,270.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(36,20,6,'ACE-005','Aceite 5W-40 Sintético',0,2,20,300.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(37,20,7,'ACE-006','Aceite 10W-40 Semisintético',0,2,20,180.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(38,20,8,'ACE-007','Aceite 10W-40 Semisintético',0,2,20,190.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(39,20,9,'ACE-008','Aceite 10W-40 Semisintético',0,2,20,170.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(40,20,10,'ACE-009','Aceite 20W-50 Mineral',0,2,20,120.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(41,20,11,'ACE-010','Aceite 20W-50 Mineral',0,2,20,125.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(42,20,12,'ACE-011','Aceite 15W-40 Diésel',0,2,20,160.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(43,20,13,'ACE-012','Aceite 15W-40 Diésel',0,2,20,155.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(44,20,14,'ACE-013','Aceite 10W-40 Diésel Sintético',0,2,20,220.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(45,20,15,'ACE-014','Aceite 80W-90 Transmisión',0,2,20,180.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(46,20,16,'ACE-015','Aceite ATF Automático',0,2,20,200.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(47,20,17,'ACE-016','Aceite 85W-140 Diferencial',0,2,20,210.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(48,20,18,'ACE-017','Aditivo Limpiador de Inyectores',0,2,20,90.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(49,20,19,'ACE-018','Aditivo para Tanque de Gasolina',0,2,20,80.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL),(50,20,20,'ACE-019','Aditivo Limpiador de Motor',0,2,20,85.00,1,'2026-06-24 10:47:03','2026-06-24 13:24:00','admin','sistema',NULL);
/*!40000 ALTER TABLE `aceites_dispensario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargas_pipa`
--

DROP TABLE IF EXISTS `cargas_pipa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargas_pipa` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cargado_por` varchar(50) DEFAULT NULL,
  `cargado_por_id` bigint DEFAULT NULL,
  `costo_total` decimal(12,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `factura` varchar(50) DEFAULT NULL,
  `fecha_carga` datetime(6) NOT NULL,
  `folio` varchar(50) NOT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `proveedor` varchar(100) DEFAULT NULL,
  `tipo_combustible` enum('DIESEL','MAGNA','PREMIUM') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `volumen` decimal(10,3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKtf73g5nbt4g9dea135nkqslty` (`folio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargas_pipa`
--

LOCK TABLES `cargas_pipa` WRITE;
/*!40000 ALTER TABLE `cargas_pipa` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargas_pipa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combustibles`
--

DROP TABLE IF EXISTS `combustibles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combustibles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `descripcion` varchar(200) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `precio_actual` decimal(10,2) NOT NULL,
  `tipo` enum('DIESEL','GASOLINA_MAGNA','GASOLINA_PREMIUM','MAGNA','PREMIUM') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKhlup26e00p222e4uikdmrcume` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combustibles`
--

LOCK TABLES `combustibles` WRITE;
/*!40000 ALTER TABLE `combustibles` DISABLE KEYS */;
INSERT INTO `combustibles` VALUES (1,_binary '','2026-04-12 18:50:43.682364','sistema','Combustible magna','Magna',18.00,'MAGNA','2026-06-16 11:20:36.957791','sistema',1),(2,_binary '','2026-04-13 21:01:45.338309','sistema','Combustible Diesel','DIESEL',28.00,'DIESEL','2026-06-16 10:50:33.474548','sistema',1),(3,_binary '','2026-04-14 18:02:27.540486','sistema','Gasolina Premium','PREMIUM',24.00,'PREMIUM','2026-06-16 11:20:58.836299','sistema',1);
/*!40000 ALTER TABLE `combustibles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras_aceites`
--

DROP TABLE IF EXISTS `compras_aceites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras_aceites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `folio` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aceite_id` bigint NOT NULL,
  `aceite_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proveedor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL,
  `iva` decimal(12,2) DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `factura` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_compra` datetime NOT NULL,
  `realizado_por_id` bigint DEFAULT NULL,
  `realizado_por_nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folio` (`folio`),
  KEY `aceite_id` (`aceite_id`),
  CONSTRAINT `compras_aceites_ibfk_1` FOREIGN KEY (`aceite_id`) REFERENCES `aceites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras_aceites`
--

LOCK TABLES `compras_aceites` WRITE;
/*!40000 ALTER TABLE `compras_aceites` DISABLE KEYS */;
/*!40000 ALTER TABLE `compras_aceites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario_combustible`
--

DROP TABLE IF EXISTS `inventario_combustible`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario_combustible` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `capacidad_tanque` decimal(10,3) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `stock_actual` decimal(10,3) NOT NULL,
  `stock_minimo` decimal(10,3) DEFAULT NULL,
  `tipo_combustible` enum('DIESEL','MAGNA','PREMIUM') NOT NULL,
  `ultima_lectura` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKj6bepjtn6w9020yo97u5m204f` (`tipo_combustible`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario_combustible`
--

LOCK TABLES `inventario_combustible` WRITE;
/*!40000 ALTER TABLE `inventario_combustible` DISABLE KEYS */;
INSERT INTO `inventario_combustible` VALUES (1,_binary '',50000.000,'2026-04-03 07:21:17.050725',NULL,'Gasolina Magna',14703.436,3000.000,'MAGNA','2026-07-15 15:58:23.658608','2026-07-15 15:58:23.669159','sistema',85),(2,_binary '',50000.000,'2026-04-03 07:21:17.070286',NULL,'Gasolina Premium',19974.999,2000.000,'PREMIUM','2026-06-28 11:29:38.312788','2026-06-28 11:29:38.312788','sistema',26),(3,_binary '',50000.000,'2026-04-03 07:21:17.071285',NULL,'Diesel',19934.857,5000.000,'DIESEL','2026-07-09 07:02:01.175411','2026-07-09 07:02:01.175919','sistema',17);
/*!40000 ALTER TABLE `inventario_combustible` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `precios_historicos`
--

DROP TABLE IF EXISTS `precios_historicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `precios_historicos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cambiado_por` varchar(50) DEFAULT NULL,
  `cambiado_por_id` bigint DEFAULT NULL,
  `fecha_cambio` datetime(6) NOT NULL,
  `motivo_cambio` varchar(200) DEFAULT NULL,
  `precio_anterior` decimal(10,2) DEFAULT NULL,
  `precio_nuevo` decimal(10,2) NOT NULL,
  `combustible_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3y64acicrj43ge0nnlxgifkth` (`combustible_id`),
  CONSTRAINT `FK3y64acicrj43ge0nnlxgifkth` FOREIGN KEY (`combustible_id`) REFERENCES `combustibles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `precios_historicos`
--

LOCK TABLES `precios_historicos` WRITE;
/*!40000 ALTER TABLE `precios_historicos` DISABLE KEYS */;
INSERT INTO `precios_historicos` VALUES (1,'sistema',1,'2026-06-16 10:50:33.438325','',24.00,28.00,2),(2,'sistema',1,'2026-06-16 11:20:36.921699','',24.00,18.00,1),(3,'sistema',1,'2026-06-16 11:20:58.834294','',30.00,24.00,3);
/*!40000 ALTER TABLE `precios_historicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transferencias_aceites`
--

DROP TABLE IF EXISTS `transferencias_aceites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transferencias_aceites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `folio` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aceite_id` bigint NOT NULL,
  `aceite_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dispensario_origen_id` bigint DEFAULT NULL,
  `dispensario_destino_id` bigint NOT NULL,
  `cantidad` int NOT NULL,
  `tipo` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `motivo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_movimiento` datetime NOT NULL,
  `realizado_por_id` bigint DEFAULT NULL,
  `realizado_por_nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folio` (`folio`),
  KEY `aceite_id` (`aceite_id`),
  CONSTRAINT `transferencias_aceites_ibfk_1` FOREIGN KEY (`aceite_id`) REFERENCES `aceites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transferencias_aceites`
--

LOCK TABLES `transferencias_aceites` WRITE;
/*!40000 ALTER TABLE `transferencias_aceites` DISABLE KEYS */;
/*!40000 ALTER TABLE `transferencias_aceites` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-18 10:44:16
CREATE DATABASE  IF NOT EXISTS `gasmanager_ventas` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gasmanager_ventas`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gasmanager_ventas
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `caras_dispensario`
--

DROP TABLE IF EXISTS `caras_dispensario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caras_dispensario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `dispensario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9mvujkd0usevatxp3cm3by8kg` (`dispensario_id`),
  CONSTRAINT `FK9mvujkd0usevatxp3cm3by8kg` FOREIGN KEY (`dispensario_id`) REFERENCES `dispensarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caras_dispensario`
--

LOCK TABLES `caras_dispensario` WRITE;
/*!40000 ALTER TABLE `caras_dispensario` DISABLE KEYS */;
INSERT INTO `caras_dispensario` VALUES (1,_binary '','A','Cara A',1),(2,_binary '','B','Cara B',1),(3,_binary '','A','Cara A',2),(4,_binary '','B','Cara B',2);
/*!40000 ALTER TABLE `caras_dispensario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cortes_turno`
--

DROP TABLE IF EXISTS `cortes_turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cortes_turno` (
  `diferencia_efectivo` decimal(10,2) DEFAULT NULL,
  `diferencia_inventario` decimal(10,3) DEFAULT NULL,
  `inventario_final_gasolina` decimal(10,3) DEFAULT NULL,
  `inventario_inicial_gasolina` decimal(10,3) DEFAULT NULL,
  `total_credito` decimal(12,2) DEFAULT NULL,
  `total_efectivo_real` decimal(12,2) DEFAULT NULL,
  `total_efectivo_reporte` decimal(12,2) DEFAULT NULL,
  `total_tarjeta` decimal(12,2) DEFAULT NULL,
  `total_transferencia` decimal(12,2) DEFAULT NULL,
  `total_ventas` decimal(12,2) DEFAULT NULL,
  `ventas_gasolina` decimal(10,3) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `fecha_corte` datetime(6) NOT NULL,
  `fecha_validacion` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `turno_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `validado_por` bigint DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `turno_codigo` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `codigo_corte` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `validado_nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_general_ci,
  `reporte_excel_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reporte_pdf_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('CERRADO','CONCILIADO','CON_DIFERENCIAS','PENDIENTE','RECHAZADO','VALIDADO') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numero_ventas` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_jeyla1tx6c5psdah2bus7hia8` (`codigo_corte`),
  KEY `FKcnw73wk7nve4exoldfx54p6ak` (`turno_id`),
  CONSTRAINT `FKcnw73wk7nve4exoldfx54p6ak` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cortes_turno`
--

LOCK TABLES `cortes_turno` WRITE;
/*!40000 ALTER TABLE `cortes_turno` DISABLE KEYS */;
/*!40000 ALTER TABLE `cortes_turno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cortes_turno_detallado`
--

DROP TABLE IF EXISTS `cortes_turno_detallado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cortes_turno_detallado` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codigo_corte` varchar(30) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `despachador_id` bigint DEFAULT NULL,
  `despachador_nombre` varchar(100) DEFAULT NULL,
  `diesel_importe` decimal(12,2) DEFAULT NULL,
  `diesel_lectura_final` decimal(10,3) DEFAULT NULL,
  `diesel_lectura_inicial` decimal(10,3) DEFAULT NULL,
  `diesel_litros_vendidos` decimal(10,3) DEFAULT NULL,
  `diesel_precio` decimal(10,2) DEFAULT NULL,
  `diferencia` decimal(12,2) DEFAULT NULL,
  `dispensario_id` bigint DEFAULT NULL,
  `dispensario_nombre` varchar(100) DEFAULT NULL,
  `efectivo_que_debe_entregar` decimal(12,2) DEFAULT NULL,
  `estado` enum('CERRADO','CON_DIFERENCIAS','PENDIENTE','RECHAZADO','VALIDADO') DEFAULT NULL,
  `magna_importe` decimal(12,2) DEFAULT NULL,
  `magna_lectura_final` decimal(10,3) DEFAULT NULL,
  `magna_lectura_inicial` decimal(10,3) DEFAULT NULL,
  `magna_litros_vendidos` decimal(10,3) DEFAULT NULL,
  `magna_precio` decimal(10,2) DEFAULT NULL,
  `observaciones` text,
  `premium_importe` decimal(12,2) DEFAULT NULL,
  `premium_lectura_final` decimal(10,3) DEFAULT NULL,
  `premium_lectura_inicial` decimal(10,3) DEFAULT NULL,
  `premium_litros_vendidos` decimal(10,3) DEFAULT NULL,
  `premium_precio` decimal(10,2) DEFAULT NULL,
  `total_aceites_importe` decimal(12,2) DEFAULT NULL,
  `total_combustibles_importe` decimal(12,2) DEFAULT NULL,
  `total_combustibles_litros` decimal(10,3) DEFAULT NULL,
  `total_credito` decimal(12,2) DEFAULT NULL,
  `total_efectivo` decimal(12,2) DEFAULT NULL,
  `total_notas_credito` decimal(12,2) DEFAULT NULL,
  `total_tarjeta` decimal(12,2) DEFAULT NULL,
  `total_transferencia` decimal(12,2) DEFAULT NULL,
  `total_ventas` decimal(12,2) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `turno_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_8n57mcqwgf6l339hxkb90ipuw` (`codigo_corte`),
  KEY `FKp74rf4toansah6eoxam2bha7w` (`turno_id`),
  CONSTRAINT `FKp74rf4toansah6eoxam2bha7w` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cortes_turno_detallado`
--

LOCK TABLES `cortes_turno_detallado` WRITE;
/*!40000 ALTER TABLE `cortes_turno_detallado` DISABLE KEYS */;
/*!40000 ALTER TABLE `cortes_turno_detallado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_aceite_corte`
--

DROP TABLE IF EXISTS `detalles_aceite_corte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_aceite_corte` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aceite_id` bigint DEFAULT NULL,
  `aceite_nombre` varchar(100) DEFAULT NULL,
  `cantidad_final` int DEFAULT NULL,
  `cantidad_inicial` int DEFAULT NULL,
  `cantidad_vendida` int DEFAULT NULL,
  `importe` decimal(12,2) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `corte_turno_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhj9jj1xw6ctcd1j240ysn7qh4` (`corte_turno_id`),
  CONSTRAINT `FKhj9jj1xw6ctcd1j240ysn7qh4` FOREIGN KEY (`corte_turno_id`) REFERENCES `cortes_turno_detallado` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_aceite_corte`
--

LOCK TABLES `detalles_aceite_corte` WRITE;
/*!40000 ALTER TABLE `detalles_aceite_corte` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalles_aceite_corte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_corte`
--

DROP TABLE IF EXISTS `detalles_corte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_corte` (
  `diferencia` decimal(10,2) DEFAULT NULL,
  `monto_esperado` decimal(10,2) DEFAULT NULL,
  `monto_real` decimal(10,2) DEFAULT NULL,
  `corte_turno_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `referencia` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `coprobante_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `onservaciones` text COLLATE utf8mb4_general_ci,
  `updated_by` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo` enum('AJUSTE_CAJA','AJUSTE_INVENTARIO','DEVOLUCION','DIFERENCIA_EFECTIVO','DIFERENCIA_INVENTARIO','FONDEO_INICIAL','GASTO_ALIMENTACION','GASTO_COMBUSTIBLE','GASTO_EXTRAORDINARIO','GASTO_MATERIALES','GASTO_TRANSPORTE','NOTA_CREDITO','PROPINA','VENTA_CREDITO','VENTA_EFECTIVO','VENTA_TARJETA','VENTA_TRANSFERENCIA') COLLATE utf8mb4_general_ci NOT NULL,
  `comprobante_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `FK1x5gqq5lbou1ao8xdmg6owq9y` (`corte_turno_id`),
  CONSTRAINT `FK1x5gqq5lbou1ao8xdmg6owq9y` FOREIGN KEY (`corte_turno_id`) REFERENCES `cortes_turno` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_corte`
--

LOCK TABLES `detalles_corte` WRITE;
/*!40000 ALTER TABLE `detalles_corte` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalles_corte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_venta`
--

DROP TABLE IF EXISTS `detalles_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_venta` (
  `cantidad` decimal(10,3) NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `producto_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `venta_id` bigint NOT NULL,
  `producto_codigo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `producto_nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_producto` enum('ACEITE_MOTOR','ADITIVO','COMBUSTIBLE_DIESEL','COMBUSTIBLE_GASOLINA_MAGNA','COMBUSTIBLE_GASOLINA_PREMIUM','OTRO') COLLATE utf8mb4_general_ci NOT NULL,
  `unidad_medida` enum('CAJAS','GALONES','GRAMOS','KILOS','LITROS','METROS_CUBICOS','PIEZAS','UNIDADES') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK453xcyfk9n6snv6qnjlo0p65p` (`venta_id`),
  CONSTRAINT `FK453xcyfk9n6snv6qnjlo0p65p` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_venta`
--

LOCK TABLES `detalles_venta` WRITE;
/*!40000 ALTER TABLE `detalles_venta` DISABLE KEYS */;
INSERT INTO `detalles_venta` VALUES (5.833,105.00,18.00,'2026-07-08 14:07:14.033396',1,1,'2026-07-08 14:07:14.033396',1,NULL,'Manguera A1','COMBUSTIBLE_GASOLINA_MAGNA','LITROS'),(5.556,100.00,18.00,'2026-07-09 07:01:34.166985',2,1,'2026-07-09 07:01:34.166985',2,NULL,'Manguera A1','COMBUSTIBLE_GASOLINA_MAGNA','LITROS'),(4.357,122.00,28.00,'2026-07-09 07:02:01.170884',3,6,'2026-07-09 07:02:01.170884',3,NULL,'Manguera A2','COMBUSTIBLE_DIESEL','LITROS'),(5.556,100.00,18.00,'2026-07-15 10:37:37.485855',4,1,'2026-07-15 10:37:37.485871',4,NULL,'MAGNA','COMBUSTIBLE_GASOLINA_MAGNA','LITROS'),(6.667,120.00,18.00,'2026-07-15 15:58:23.618360',5,1,'2026-07-15 15:58:23.618376',5,NULL,'MAGNA','COMBUSTIBLE_GASOLINA_MAGNA','LITROS');
/*!40000 ALTER TABLE `detalles_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispensarios`
--

DROP TABLE IF EXISTS `dispensarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dispensarios` (
  `capacidad_tanque` decimal(10,3) DEFAULT NULL,
  `lectura_actual` decimal(10,3) DEFAULT NULL,
  `lectura_inicial` decimal(10,3) DEFAULT NULL,
  `mangueras` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `proxima_calibracion` datetime(6) DEFAULT NULL,
  `ultima_calibracion` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `numero` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ubicacion` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('ACTIVO','CALIBRACION','FUERA_SERVICIO','INACTIVO','MANTENIMIENTO','SIN_COMBUSTIBLE') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo_combustible` enum('DIESEL','ELECTRICO','GASOLINA_MAGNA','GASOLINA_PREMIUM','GAS_LP','HIBRIDO','OTRO') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activo` bit(1) DEFAULT NULL,
  `tiene_dos_caras` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_cv7sd060b1q3yn7ullr1xfn8n` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispensarios`
--

LOCK TABLES `dispensarios` WRITE;
/*!40000 ALTER TABLE `dispensarios` DISABLE KEYS */;
INSERT INTO `dispensarios` VALUES (NULL,0.000,0.000,4,'2026-06-28 10:53:29.112931',1,NULL,NULL,'2026-06-28 10:53:29.112931',0,'01',NULL,'Dispensario 1',NULL,'Isla 1','ACTIVO',NULL,_binary '',_binary ''),(NULL,0.000,0.000,4,'2026-06-28 11:27:13.017172',2,NULL,NULL,'2026-06-28 11:27:13.017172',0,'02',NULL,'Dispensario 2',NULL,'Isla 2','ACTIVO',NULL,_binary '',_binary '');
/*!40000 ALTER TABLE `dispensarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturas_base`
--

DROP TABLE IF EXISTS `lecturas_base`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturas_base` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aceite_id` bigint DEFAULT NULL,
  `aceite_nombre` varchar(100) DEFAULT NULL,
  `cantidad_inicial` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `lectura_inicial` decimal(10,3) DEFAULT NULL,
  `manguera_id` bigint DEFAULT NULL,
  `manguera_nombre` varchar(50) DEFAULT NULL,
  `precio_por_litro` decimal(10,2) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `tipo_combustible` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturas_base`
--

LOCK TABLES `lecturas_base` WRITE;
/*!40000 ALTER TABLE `lecturas_base` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecturas_base` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturas_finales_turno`
--

DROP TABLE IF EXISTS `lecturas_finales_turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturas_finales_turno` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aceite_id` bigint DEFAULT NULL,
  `aceite_nombre` varchar(100) DEFAULT NULL,
  `cantidad_final` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `lectura_final` decimal(10,3) DEFAULT NULL,
  `manguera_id` bigint DEFAULT NULL,
  `manguera_nombre` varchar(50) DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `tipo_combustible` varchar(30) DEFAULT NULL,
  `turno_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKknngsvtf67aoko1l3ht2nfyie` (`turno_id`),
  CONSTRAINT `FKknngsvtf67aoko1l3ht2nfyie` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturas_finales_turno`
--

LOCK TABLES `lecturas_finales_turno` WRITE;
/*!40000 ALTER TABLE `lecturas_finales_turno` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecturas_finales_turno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturas_iniciales_turno`
--

DROP TABLE IF EXISTS `lecturas_iniciales_turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturas_iniciales_turno` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aceite_id` bigint DEFAULT NULL,
  `aceite_nombre` varchar(100) DEFAULT NULL,
  `cantidad_inicial` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `lectura_inicial` decimal(10,3) DEFAULT NULL,
  `manguera_id` bigint DEFAULT NULL,
  `manguera_nombre` varchar(50) DEFAULT NULL,
  `precio_por_litro` decimal(10,2) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `tipo_combustible` varchar(30) DEFAULT NULL,
  `turno_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKek37uhf8bmxmtpaic7c2823ol` (`turno_id`),
  CONSTRAINT `FKek37uhf8bmxmtpaic7c2823ol` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturas_iniciales_turno`
--

LOCK TABLES `lecturas_iniciales_turno` WRITE;
/*!40000 ALTER TABLE `lecturas_iniciales_turno` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecturas_iniciales_turno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mangueras`
--

DROP TABLE IF EXISTS `mangueras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mangueras` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `codigo` varchar(20) NOT NULL,
  `combustible_id` bigint DEFAULT NULL,
  `lectura_actual` decimal(10,3) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `tipo_combustible` varchar(20) NOT NULL,
  `cara_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK685j8ro5pq8x1ftqmd39lh6ve` (`cara_id`),
  CONSTRAINT `FK685j8ro5pq8x1ftqmd39lh6ve` FOREIGN KEY (`cara_id`) REFERENCES `caras_dispensario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mangueras`
--

LOCK TABLES `mangueras` WRITE;
/*!40000 ALTER TABLE `mangueras` DISABLE KEYS */;
INSERT INTO `mangueras` VALUES (1,_binary '','A1',1,0.000,'Manguera A1','MAGNA',1),(2,_binary '','A2',3,0.000,'Manguera A2','PREMIUM',1),(3,_binary '','B1',1,0.000,'Manguera B1','MAGNA',2),(4,_binary '','B2',3,0.000,'Manguera B2','PREMIUM',2),(5,_binary '','A1',1,0.000,'Manguera A1','MAGNA',3),(6,_binary '','A2',2,0.000,'Manguera A2','DIESEL',3),(7,_binary '','B1',1,0.000,'Manguera B1','MAGNA',4),(8,_binary '','B2',2,0.000,'Manguera B2','DIESEL',4);
/*!40000 ALTER TABLE `mangueras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas_credito_corte`
--

DROP TABLE IF EXISTS `notas_credito_corte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas_credito_corte` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `autorizado_por` varchar(100) DEFAULT NULL,
  `cliente_nombre` varchar(150) DEFAULT NULL,
  `folio_nota` varchar(50) NOT NULL,
  `litros` decimal(10,3) DEFAULT NULL,
  `monto` decimal(12,2) DEFAULT NULL,
  `tipo_combustible` varchar(30) DEFAULT NULL,
  `corte_turno_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK66xyvfv0pgw6vonaqrfej4ra8` (`corte_turno_id`),
  CONSTRAINT `FK66xyvfv0pgw6vonaqrfej4ra8` FOREIGN KEY (`corte_turno_id`) REFERENCES `cortes_turno_detallado` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas_credito_corte`
--

LOCK TABLES `notas_credito_corte` WRITE;
/*!40000 ALTER TABLE `notas_credito_corte` DISABLE KEYS */;
/*!40000 ALTER TABLE `notas_credito_corte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas_credito_turno`
--

DROP TABLE IF EXISTS `notas_credito_turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas_credito_turno` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `autorizado_por` varchar(100) DEFAULT NULL,
  `cliente_id` bigint DEFAULT NULL,
  `cliente_nombre` varchar(150) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `folio_nota` varchar(50) NOT NULL,
  `litros` decimal(10,3) DEFAULT NULL,
  `monto` decimal(12,2) DEFAULT NULL,
  `observaciones` text,
  `tipo_combustible` varchar(30) DEFAULT NULL,
  `vehiculo_placas` varchar(20) DEFAULT NULL,
  `turno_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmdag8nrobtx0jr9gd48ln0sj0` (`turno_id`),
  CONSTRAINT `FKmdag8nrobtx0jr9gd48ln0sj0` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas_credito_turno`
--

LOCK TABLES `notas_credito_turno` WRITE;
/*!40000 ALTER TABLE `notas_credito_turno` DISABLE KEYS */;
/*!40000 ALTER TABLE `notas_credito_turno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transacciones_dispensario`
--

DROP TABLE IF EXISTS `transacciones_dispensario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacciones_dispensario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) DEFAULT NULL,
  `fecha_hora` datetime(6) DEFAULT NULL,
  `litros` decimal(38,2) DEFAULT NULL,
  `surtidor_id` bigint DEFAULT NULL,
  `tipo_combustible` varchar(255) DEFAULT NULL,
  `total` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transacciones_dispensario`
--

LOCK TABLES `transacciones_dispensario` WRITE;
/*!40000 ALTER TABLE `transacciones_dispensario` DISABLE KEYS */;
/*!40000 ALTER TABLE `transacciones_dispensario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos`
--

DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos` (
  `diferencia` decimal(10,2) DEFAULT NULL,
  `hora_fin` time(6) DEFAULT NULL,
  `hora_inicio` time(6) NOT NULL,
  `litros_vendidos` decimal(10,3) DEFAULT NULL,
  `numero_clientes` int DEFAULT NULL,
  `numero_ventas` int DEFAULT NULL,
  `total_credito` decimal(12,2) DEFAULT NULL,
  `total_efectivo` decimal(12,2) DEFAULT NULL,
  `total_tarjeta` decimal(12,2) DEFAULT NULL,
  `total_tranferencia` decimal(12,2) DEFAULT NULL,
  `total_ventas` decimal(12,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `fecha_turno` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `supervisor_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `codigo_turno` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `supervisor_nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_general_ci,
  `estado` enum('ABIERTO','CERRADO','CONCILIADO','AUDITADO','PENDIENTE_VALIDACION','CANCELADO') COLLATE utf8mb4_general_ci NOT NULL,
  `total_transferencia` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_dvi12roi1l7xqu9ndeaommufo` (`codigo_turno`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos`
--

LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;
INSERT INTO `turnos` VALUES (NULL,'07:00:03.054000','14:06:00.000000',5.833,0,2,NULL,NULL,NULL,NULL,210.00,'2026-07-08 14:06:42.342064','2026-07-08 20:06:00.000000',1,1,'2026-07-09 07:00:03.060682',2,'TURNO-20260708-0001',NULL,'Turno 1',NULL,NULL,NULL,'CERRADO',NULL),(NULL,NULL,'07:00:00.000000',9.913,0,6,NULL,NULL,NULL,NULL,664.00,'2026-07-09 07:00:51.207197','2026-07-09 13:00:00.000000',2,1,'2026-07-15 15:58:23.699025',4,'TURNO-20260709-0002',NULL,'Turno X',NULL,NULL,NULL,'ABIERTO',NULL),(NULL,NULL,'10:36:00.000000',NULL,0,0,NULL,NULL,NULL,NULL,NULL,'2026-07-15 10:37:17.352582','2026-07-15 10:36:00.000000',3,1,'2026-07-15 10:37:17.352629',0,'TURNO-20260715-0003',NULL,'Turno 10',NULL,NULL,NULL,'ABIERTO',NULL),(NULL,NULL,'15:57:00.000000',NULL,0,0,NULL,NULL,NULL,NULL,NULL,'2026-07-15 15:58:04.485770','2026-07-15 15:57:00.000000',4,1,'2026-07-15 15:58:04.485825',0,'TURNO-20260715-0004',NULL,'Turno 12',NULL,NULL,NULL,'ABIERTO',NULL);
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `es_credito` bit(1) DEFAULT NULL,
  `facturada` bit(1) DEFAULT NULL,
  `iva` decimal(10,2) NOT NULL,
  `puntos_canjeados` int DEFAULT NULL,
  `puntos_obtenidos` int DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `surtidor_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `cliente_id` bigint DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `credito_id` bigint DEFAULT NULL,
  `despachador_id` bigint NOT NULL,
  `fecha_hora` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `turno_id` bigint NOT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `surtidor_numero` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cliente_rfc` varchar(13) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `folio` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `folio_factura` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `update_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `despachador_nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cliente_nombre` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('CANCELADA','COMPLETADA','CREDITO_PENDIENTE','FACTURADA','PENDIENTE') COLLATE utf8mb4_general_ci NOT NULL,
  `metodo_pago` enum('CREDITO','EFECTIVO','PUNTOS_LEALTAD','TARJETA_CREDITO','TARJETA_DEBITO','TRANSFERENCIA') COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `dispensario_id` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_b5y0botwo90l4gfoixw3kjnhr` (`folio`),
  KEY `FKhs9hv6wnwe7lvxhjpvv2q1obm` (`turno_id`),
  CONSTRAINT `FKhs9hv6wnwe7lvxhjpvv2q1obm` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (_binary '\0',_binary '\0',14.48,0,0,90.52,1,105.00,NULL,NULL,NULL,2,'2026-07-08 14:07:14.031974',1,1,NULL,0,NULL,NULL,NULL,'IOT-20260708140714-0561',NULL,NULL,'Marco Adrian Carrasco  Torres',NULL,'COMPLETADA','EFECTIVO','2026-07-08 14:07:14.031974',1,'2026-07-08 14:07:14.031974',NULL),(_binary '\0',_binary '\0',13.79,0,0,86.21,1,100.00,NULL,NULL,NULL,2,'2026-07-09 07:01:34.163472',2,2,NULL,0,NULL,NULL,NULL,'IOT-20260709070134-8130',NULL,NULL,'Marco Adrian Carrasco  Torres',NULL,'COMPLETADA','EFECTIVO','2026-07-09 07:01:34.163472',1,'2026-07-09 07:01:34.163472',NULL),(_binary '\0',_binary '\0',16.83,0,0,105.17,6,122.00,NULL,NULL,NULL,1,'2026-07-09 07:02:01.169885',3,2,NULL,0,NULL,NULL,NULL,'IOT-20260709070201-2640',NULL,NULL,'Carlos López Hernández',NULL,'COMPLETADA','EFECTIVO','2026-07-09 07:02:01.169885',2,'2026-07-09 07:02:01.169885',NULL),(_binary '\0',_binary '\0',13.79,0,0,86.21,1,100.00,NULL,NULL,NULL,2,'2026-07-15 10:37:37.479664',4,2,NULL,0,'A1',NULL,NULL,'VENTA-20260715-163737-7478',NULL,NULL,'Marco Adrian Carrasco ',NULL,'COMPLETADA','EFECTIVO','2026-07-15 10:37:37.479653',1,'2026-07-15 10:37:37.479666',NULL),(_binary '\0',_binary '\0',16.55,0,0,103.45,1,120.00,NULL,NULL,NULL,2,'2026-07-15 15:58:23.612950',5,2,NULL,0,'A1',NULL,NULL,'VENTA-20260715-215823-3611',NULL,NULL,'Marco Adrian Carrasco ',NULL,'COMPLETADA','EFECTIVO','2026-07-15 15:58:23.612940',1,'2026-07-15 15:58:23.612954',NULL);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-18 10:44:16
CREATE DATABASE  IF NOT EXISTS `gasmanager_facturacion` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gasmanager_facturacion`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gasmanager_facturacion
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `facturas`
--

DROP TABLE IF EXISTS `facturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cadena_original` text,
  `cliente_codigo_postal` varchar(5) DEFAULT NULL,
  `cliente_email` varchar(100) DEFAULT NULL,
  `cliente_id` bigint DEFAULT NULL,
  `cliente_nombre` varchar(150) NOT NULL,
  `cliente_regimen_fiscal` varchar(3) DEFAULT NULL,
  `cliente_rfc` varchar(13) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `descuento` decimal(12,2) DEFAULT NULL,
  `estado` enum('CANCELADA','EMITIDA','ERROR_TIMBRADO','PENDIENTE_TIMBRADO') NOT NULL,
  `fecha_emision` datetime(6) NOT NULL,
  `fecha_timbrado` datetime(6) DEFAULT NULL,
  `folio` varchar(10) DEFAULT NULL,
  `folio_factura` varchar(30) NOT NULL,
  `forma_pago` enum('CHEQUE','EFECTIVO','TARJETA_CREDITO','TARJETA_DEBITO','TRANSFERENCIA') DEFAULT NULL,
  `iva` decimal(12,2) NOT NULL,
  `metodo_pago` enum('PAGO_EN_PARCIALIDADES','PAGO_EN_UNA_EXHIBICION') DEFAULT NULL,
  `no_certificado` varchar(20) DEFAULT NULL,
  `no_certificado_sat` varchar(20) DEFAULT NULL,
  `observaciones` text,
  `pdf_path` varchar(255) DEFAULT NULL,
  `sello_cfd` text,
  `sello_sat` text,
  `serie` varchar(10) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `uuid_cfdi` varchar(36) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `xml_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKl74hh4ckshxawujsmfrkxa259` (`folio_factura`),
  UNIQUE KEY `UKjnvmlpyiprsmi0tmiodwe824n` (`uuid_cfdi`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturas`
--

LOCK TABLES `facturas` WRITE;
/*!40000 ALTER TABLE `facturas` DISABLE KEYS */;
INSERT INTO `facturas` VALUES (1,NULL,'06000','juan.perez@example.com',1,'Juan Pérez González','601','PEGJ900101ABC','2026-05-26 08:24:37.840039','SISTEMA',NULL,'EMITIDA','2026-05-26 08:24:37.826039',NULL,NULL,'FAC-20260526082437-0001','EFECTIVO',13.79,'PAGO_EN_UNA_EXHIBICION',NULL,NULL,'Factura de prueba - Venta 33','/facturas/FAC-20260526082437-0001.pdf',NULL,NULL,NULL,86.21,100.00,'2026-05-26 08:24:37.869038','SISTEMA',NULL,1,'/facturas/FAC-20260526082437-0001.xml'),(2,NULL,'06000','juan.perez@example.com',1,'Juan Pérez González','601','PEGJ900101ABC','2026-05-26 08:27:09.643094','SISTEMA',NULL,'EMITIDA','2026-05-26 08:27:09.643095',NULL,NULL,'FAC-20260526082709-0002','TRANSFERENCIA',41.38,'PAGO_EN_UNA_EXHIBICION',NULL,NULL,'Factura consolidada - Ventas 34 y 35','/facturas/FAC-20260526082709-0002.pdf',NULL,NULL,NULL,258.62,300.00,'2026-05-26 08:27:09.649605','SISTEMA',NULL,1,'/facturas/FAC-20260526082709-0002.xml'),(3,NULL,NULL,'juan.perez@example.com',1,'Juan Pérez González','601','PEGJ900101ABC','2026-05-27 20:30:41.864552','SISTEMA',NULL,'EMITIDA','2026-05-27 20:30:41.853529',NULL,NULL,'FAC-20260527203041-0003','EFECTIVO',68.97,'PAGO_EN_UNA_EXHIBICION',NULL,NULL,NULL,'/facturas/FAC-20260527203041-0003.pdf',NULL,NULL,NULL,431.03,500.00,'2026-05-27 20:30:41.878087','SISTEMA',NULL,1,'/facturas/FAC-20260527203041-0003.xml'),(4,NULL,NULL,'juan.perez@example.com',1,'Juan Pérez González','601','PEGJ900101ABC','2026-06-02 11:27:50.262242','SISTEMA',NULL,'EMITIDA','2026-06-02 11:27:50.246242',NULL,NULL,'FAC-20260602112750-0004','EFECTIVO',20.69,'PAGO_EN_UNA_EXHIBICION',NULL,NULL,NULL,'/facturas/FAC-20260602112750-0004.pdf',NULL,NULL,NULL,129.31,150.00,'2026-06-02 11:27:50.296319','SISTEMA',NULL,1,'/facturas/FAC-20260602112750-0004.xml');
/*!40000 ALTER TABLE `facturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facturas_detalle`
--

DROP TABLE IF EXISTS `facturas_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas_detalle` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cantidad` decimal(10,3) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `iva` decimal(12,2) DEFAULT NULL,
  `monto` decimal(12,2) NOT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `producto_descripcion` varchar(200) DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `venta_fecha` datetime(6) NOT NULL,
  `venta_folio` varchar(50) NOT NULL,
  `venta_id` bigint NOT NULL,
  `factura_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK47v5yic0ws5djxs49yu117x9w` (`factura_id`),
  CONSTRAINT `FK47v5yic0ws5djxs49yu117x9w` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturas_detalle`
--

LOCK TABLES `facturas_detalle` WRITE;
/*!40000 ALTER TABLE `facturas_detalle` DISABLE KEYS */;
INSERT INTO `facturas_detalle` VALUES (1,NULL,'2026-05-26 08:24:37.854039',13.79,100.00,NULL,'Combustible y lubricantes',86.21,'2026-05-26 08:24:37.854039','2026-05-20 20:07:54.546475','VENTA-20260520-200754-4535',33,1),(2,NULL,'2026-05-26 08:27:09.645753',27.59,200.00,NULL,'Combustible y lubricantes',172.41,'2026-05-26 08:27:09.645753','2026-05-20 20:08:10.607145','VENTA-20260520-200810-0607',34,2),(3,NULL,'2026-05-26 08:27:09.647094',13.79,100.00,NULL,'Combustible y lubricantes',86.21,'2026-05-26 08:27:09.647094','2026-05-23 18:46:14.974462','VENTA-20260523-184614-4963',35,2),(4,NULL,'2026-05-27 20:30:41.872067',68.97,500.00,NULL,'Combustible y lubricantes',431.03,'2026-05-27 20:30:41.872067','2026-05-20 05:11:11.601630','VENTA-20260520-051111-1601',32,3),(5,NULL,'2026-06-02 11:27:50.279243',20.69,150.00,NULL,'Combustible y lubricantes',129.31,'2026-06-02 11:27:50.279243','2026-05-19 21:36:32.839694','VENTA-20260519-213632-2839',31,4);
/*!40000 ALTER TABLE `facturas_detalle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-18 10:44:16
CREATE DATABASE  IF NOT EXISTS `gasmanager_compras` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gasmanager_compras`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gasmanager_compras
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `detalles_orden_compra`
--

DROP TABLE IF EXISTS `detalles_orden_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_orden_compra` (
  `cantidad` decimal(10,3) NOT NULL,
  `iva` decimal(12,2) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `orden_compra_id` bigint NOT NULL,
  `producto_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `producto_nombre` varchar(100) NOT NULL,
  `tipo_producto` enum('ACEITE_MOTOR','ADITIVO','COMBUSTIBLE_DIESEL','COMBUSTIBLE_MAGNA','COMBUSTIBLE_PREMIUM','OTRO') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5meqh3ntsthdona9ung826afc` (`orden_compra_id`),
  CONSTRAINT `FK5meqh3ntsthdona9ung826afc` FOREIGN KEY (`orden_compra_id`) REFERENCES `ordenes_compra` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_orden_compra`
--

LOCK TABLES `detalles_orden_compra` WRITE;
/*!40000 ALTER TABLE `detalles_orden_compra` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalles_orden_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenes_compra`
--

DROP TABLE IF EXISTS `ordenes_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes_compra` (
  `fecha_entrega` date DEFAULT NULL,
  `fecha_orden` date NOT NULL,
  `iva` decimal(12,2) DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `proveedor_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `folio_orden` varchar(30) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `factura` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `observaciones` text,
  `estado` enum('CANCELADA','PARCIAL','PENDIENTE','RECIBIDA') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnn3ph2yqcver3lfm6j4dtcmyx` (`folio_orden`),
  KEY `FK7ximp03n72hmygxmikaapavac` (`proveedor_id`),
  CONSTRAINT `FK7ximp03n72hmygxmikaapavac` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes_compra`
--

LOCK TABLES `ordenes_compra` WRITE;
/*!40000 ALTER TABLE `ordenes_compra` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordenes_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `activo` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `rfc` varchar(13) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `codigo_proveedor` varchar(50) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `direccion` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKp1slk3xonh8v4hgmc72esnfn1` (`codigo_proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-18 10:44:17
CREATE DATABASE  IF NOT EXISTS `gasmanager_nomina` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gasmanager_nomina`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gasmanager_nomina
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `departamentos`
--

DROP TABLE IF EXISTS `departamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamentos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamentos`
--

LOCK TABLES `departamentos` WRITE;
/*!40000 ALTER TABLE `departamentos` DISABLE KEYS */;
INSERT INTO `departamentos` VALUES (1,_binary '','2026-05-26 15:06:48.420860','SISTEMA','Departamento de operaciones de la gasolinera','Operaciones','2026-05-26 15:06:48.420860','SISTEMA',0),(2,_binary '','2026-06-17 11:55:59.333917','SISTEMA','Departamento administrativo y finanzas','Administración','2026-06-17 11:55:59.333917','SISTEMA',0),(3,_binary '','2026-06-17 11:56:05.876738','SISTEMA','Departamento de ventas y atención al cliente','Ventas','2026-06-17 11:56:05.876738','SISTEMA',0);
/*!40000 ALTER TABLE `departamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `apellido_materno` varchar(50) DEFAULT NULL,
  `apellido_paterno` varchar(50) NOT NULL,
  `banco` varchar(50) DEFAULT NULL,
  `celular` varchar(15) DEFAULT NULL,
  `codigo_empleado` varchar(50) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `curp` varchar(18) DEFAULT NULL,
  `direccion` text,
  `email` varchar(100) DEFAULT NULL,
  `fecha_baja` date DEFAULT NULL,
  `fecha_ingreso` date NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `nss` varchar(20) DEFAULT NULL,
  `numero_cuenta` varchar(20) DEFAULT NULL,
  `rfc` varchar(13) DEFAULT NULL,
  `salario_diario` decimal(12,2) DEFAULT NULL,
  `salario_mensual` decimal(12,2) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `tipo_contrato` enum('INDEFINIDO','POR_TIEMPO_DETERMINADO','PRACTICAS','TEMPORAL') DEFAULT NULL,
  `tipo_jornada` enum('DIURNA','MIXTA','NOCTURNA','TURNO_ROTATIVO') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `departamento_id` bigint DEFAULT NULL,
  `puesto_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK424hpcm1dftn3bngbg7bwt8yv` (`codigo_empleado`),
  UNIQUE KEY `UK9388qq89dhsl54fn29okch1mk` (`rfc`),
  KEY `FK1dvvcamb3oxb2d9xqd9taug0u` (`departamento_id`),
  KEY `FK3ywen1vm1hi0garl3dhnsalva` (`puesto_id`),
  CONSTRAINT `FK1dvvcamb3oxb2d9xqd9taug0u` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`),
  CONSTRAINT `FK3ywen1vm1hi0garl3dhnsalva` FOREIGN KEY (`puesto_id`) REFERENCES `puestos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (1,_binary '','Hernández','López','BBVA','5551234567','EMP-20260526151142-0001','2026-05-26 15:11:42.212302','SISTEMA','LOHC900101HDFRNN01','Calle Principal #123, Colonia Centro','carlos.lopez@example.com',NULL,'2025-01-15',NULL,'Carlos','12345678901','1234567890','LOHC900101ABC',250.00,7500.00,'5551234567','INDEFINIDO','DIURNA','2026-05-26 15:11:42.212302','SISTEMA',0,1,1),(2,_binary '','Torres','Carrasco ','BBVA','2711868706','EMP-20260617115809-0002','2026-06-17 11:58:09.038321','SISTEMA','CART031016HDFRRL09','calle 37 Avenidas 5 y 11 bis No. 18 La Sidra\nPopular Lazaro Cardenas','clp7432@gmail.com',NULL,'2026-06-17','2003-10-16','Marco Adrian','321455666','1234567890','CART031016H5R',300.00,9000.00,'2711868706','INDEFINIDO','TURNO_ROTATIVO','2026-06-17 11:58:09.038321','SISTEMA',0,3,1);
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados_puesto_historial`
--

DROP TABLE IF EXISTS `empleados_puesto_historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados_puesto_historial` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `motivo_cambio` varchar(200) DEFAULT NULL,
  `salario_diario` decimal(12,2) DEFAULT NULL,
  `salario_mensual` decimal(12,2) DEFAULT NULL,
  `empleado_id` bigint NOT NULL,
  `puesto_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmaw9an32d0jt5r4pcej136cle` (`empleado_id`),
  KEY `FKt0f03kr8wmhcwmwsf37x69264` (`puesto_id`),
  CONSTRAINT `FKmaw9an32d0jt5r4pcej136cle` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`),
  CONSTRAINT `FKt0f03kr8wmhcwmwsf37x69264` FOREIGN KEY (`puesto_id`) REFERENCES `puestos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados_puesto_historial`
--

LOCK TABLES `empleados_puesto_historial` WRITE;
/*!40000 ALTER TABLE `empleados_puesto_historial` DISABLE KEYS */;
/*!40000 ALTER TABLE `empleados_puesto_historial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidencias`
--

DROP TABLE IF EXISTS `incidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidencias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `autorizado_por` varchar(100) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `fecha` date NOT NULL,
  `monto` decimal(12,2) DEFAULT NULL,
  `observaciones` text,
  `tipo` enum('AGUINALDO','BONO','FALTA','HORA_EXTRA_DOBLE','HORA_EXTRA_TRIPLE','PERMISO_CON_GOCE','PERMISO_SIN_GOCE','PRIMA_VACACIONAL','RETARDO','VACACION') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `empleado_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKivhx6id6simg6160gv3nla6ft` (`empleado_id`),
  CONSTRAINT `FKivhx6id6simg6160gv3nla6ft` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidencias`
--

LOCK TABLES `incidencias` WRITE;
/*!40000 ALTER TABLE `incidencias` DISABLE KEYS */;
INSERT INTO `incidencias` VALUES (1,'Supervisor',1.00,'2026-05-26 15:13:26.898382','SISTEMA','2026-05-20',NULL,'Falta justificada con permiso','FALTA','2026-05-26 15:13:26.898382','SISTEMA',1),(2,'Gerente',NULL,'2026-05-26 15:13:59.112517','SISTEMA','2026-05-25',500.00,'Bono por productividad','BONO','2026-05-26 15:13:59.112517','SISTEMA',1);
/*!40000 ALTER TABLE `incidencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nominas`
--

DROP TABLE IF EXISTS `nominas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nominas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `estado` enum('CANCELADA','PAGADA','PROCESADA') NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `fecha_procesamiento` datetime(6) DEFAULT NULL,
  `folio_nomina` varchar(30) NOT NULL,
  `observaciones` text,
  `periodo_fin` date NOT NULL,
  `periodo_inicio` date NOT NULL,
  `total_bonos` decimal(14,2) DEFAULT NULL,
  `total_deducciones` decimal(14,2) DEFAULT NULL,
  `total_empleados` int DEFAULT NULL,
  `total_horas_extras` decimal(14,2) DEFAULT NULL,
  `total_impuestos` decimal(14,2) DEFAULT NULL,
  `total_neto` decimal(14,2) DEFAULT NULL,
  `total_sueldos` decimal(14,2) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKdqx895ix2wv3n51i4efm1fbeg` (`folio_nomina`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nominas`
--

LOCK TABLES `nominas` WRITE;
/*!40000 ALTER TABLE `nominas` DISABLE KEYS */;
INSERT INTO `nominas` VALUES (1,'2026-05-26 15:14:30.355810','SISTEMA','PAGADA','2026-06-05','2026-05-26 15:14:30.354809','NOM-20260526151430-0001','Nómina quincenal mayo 2026','2026-05-31','2026-05-01',500.00,1315.88,1,0.00,734.63,6434.12,7500.00,'2026-05-26 15:15:54.560124','SISTEMA',2),(2,'2026-06-02 11:30:14.764611','SISTEMA','PROCESADA','2026-06-02','2026-06-02 11:30:14.763612','NOM-20260602113014-0002',NULL,'2026-06-02','2026-06-02',0.00,1269.93,1,0.00,707.43,6230.07,7500.00,'2026-06-02 11:30:14.814130','SISTEMA',1);
/*!40000 ALTER TABLE `nominas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nominas_detalle`
--

DROP TABLE IF EXISTS `nominas_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nominas_detalle` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bonos` decimal(12,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `cuota_sindical` decimal(12,2) DEFAULT NULL,
  `dias_trabajados` decimal(10,2) DEFAULT NULL,
  `faltas` decimal(10,2) DEFAULT NULL,
  `faltas_descuento` decimal(12,2) DEFAULT NULL,
  `horas_extras` decimal(10,2) DEFAULT NULL,
  `horas_extras_monto` decimal(12,2) DEFAULT NULL,
  `infonavit` decimal(12,2) DEFAULT NULL,
  `isr` decimal(12,2) DEFAULT NULL,
  `neto_pagar` decimal(12,2) DEFAULT NULL,
  `otras_deducciones` decimal(12,2) DEFAULT NULL,
  `seguro_social` decimal(12,2) DEFAULT NULL,
  `sueldo_base` decimal(12,2) DEFAULT NULL,
  `total_deducciones` decimal(12,2) DEFAULT NULL,
  `total_gravado` decimal(12,2) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `empleado_id` bigint NOT NULL,
  `nomina_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2550ia0bw64hw2vktxibqf6wl` (`empleado_id`),
  KEY `FK6i7mfbyq6utdjr3tf6h36fqhn` (`nomina_id`),
  CONSTRAINT `FK2550ia0bw64hw2vktxibqf6wl` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`),
  CONSTRAINT `FK6i7mfbyq6utdjr3tf6h36fqhn` FOREIGN KEY (`nomina_id`) REFERENCES `nominas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nominas_detalle`
--

LOCK TABLES `nominas_detalle` WRITE;
/*!40000 ALTER TABLE `nominas_detalle` DISABLE KEYS */;
INSERT INTO `nominas_detalle` VALUES (1,500.00,'2026-05-26 15:14:30.367358',77.50,30.00,1.00,250.00,0.00,0.00,193.75,734.63,6434.12,NULL,310.00,7500.00,1315.88,7750.00,'2026-05-26 15:14:30.367358',1,1),(2,0.00,'2026-06-02 11:30:14.774122',75.00,30.00,0.00,0.00,0.00,0.00,187.50,707.43,6230.07,NULL,300.00,7500.00,1269.93,7500.00,'2026-06-02 11:30:14.774122',1,2);
/*!40000 ALTER TABLE `nominas_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puestos`
--

DROP TABLE IF EXISTS `puestos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puestos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `riesgo_puesto` varchar(20) DEFAULT NULL,
  `salario_base` decimal(12,2) DEFAULT NULL,
  `salario_diario` decimal(12,2) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puestos`
--

LOCK TABLES `puestos` WRITE;
/*!40000 ALTER TABLE `puestos` DISABLE KEYS */;
INSERT INTO `puestos` VALUES (1,_binary '','2026-05-26 15:08:04.080916','SISTEMA','Encargado de la carga de combustible','Despachador','ALTO',7500.00,250.00,'2026-05-26 15:08:04.080916','SISTEMA',0),(2,_binary '','2026-06-02 11:29:28.564299','SISTEMA','Despachador del turno Nocturno','Despachador2','MEDIO',6000.00,200.00,'2026-06-02 11:29:28.564299','SISTEMA',0),(3,_binary '','2026-06-17 11:55:09.198966','SISTEMA','Supervisor de operaciones y validación de cortes','Supervisor','MEDIO',20000.00,666.67,'2026-06-17 11:55:09.198966','SISTEMA',0),(4,_binary '','2026-06-17 11:55:20.027154','SISTEMA','Gerente general de la gasolinera','Gerente','BAJO',30000.00,1000.00,'2026-06-17 11:55:20.027154','SISTEMA',0),(5,_binary '','2026-06-17 11:55:27.699585','SISTEMA','Personal administrativo y de oficina','Administrativo','BAJO',12000.00,400.00,'2026-06-17 11:55:27.699585','SISTEMA',0);
/*!40000 ALTER TABLE `puestos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-18 10:44:17
