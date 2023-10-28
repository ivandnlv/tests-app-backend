-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tests_db
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `question_text` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `test_id` (`test_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (17,5,'Чему равно значение выражения 2 + 3?'),(18,5,'Какое число является результатом умножения 9 на 8?'),(19,5,'Какой знак стоит вместо вопросительного знака: 9 > ? (9 больше ... )'),(20,5,'Решите уравнение: 3x - 5 = 10.'),(21,5,'Как называется геометрическая фигура с четырьмя равными сторонами и четырьмя прямыми углами?'),(22,18,'Сколько будет 2 + 2?'),(23,18,'Как рассшифровыввается СССР'),(24,19,'Сколько будет 2 + 2?'),(25,19,'Как рассшифровыввается СССР'),(26,20,'Сколько будет 2 + 2?'),(27,20,'Как рассшифровыввается СССР'),(28,21,'Сколько будет 2 + 2?'),(29,21,'Как рассшифровыввается СССР'),(30,22,'Сколько будет 2 + 2?'),(31,22,'Как рассшифровыввается СССР'),(34,24,'Сколько будет 2 + 2?'),(35,24,'Как рассшифровыввается СССР'),(36,28,'Сколько будет 2 + 2?'),(37,28,'Как рассшифровыввается СССР'),(40,32,'Сколько будет 2 + 2?'),(41,32,'Как рассшифровыввается СССР'),(42,32,'Как рассшифровыввается СССР');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-28 16:35:58
