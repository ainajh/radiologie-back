-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 25 jan. 2024 à 09:21
-- Version du serveur :  10.4.18-MariaDB
-- Version de PHP : 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `radiologie`
--

-- --------------------------------------------------------

--
-- Structure de la table `codes`
--

CREATE TABLE `codes` (
  `id` int(11) NOT NULL,
  `code` int(11) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `codes`
--

INSERT INTO `codes` (`id`, `code`, `email`) VALUES
(17, 935701, 'tommymiza6@gmail.com'),
(19, 393520, 'tommymiza6@gmail.com'),
(20, 357416, 'tommymiza6@gmail.com'),
(21, 103620, 'tommymiza20@gmail.com'),
(22, 953757, 'tommymiza20@gmail.com'),
(23, 993142, 'tommymiza20@gmail.com'),
(24, 350367, ''),
(25, 309817, ''),
(26, 719124, 'tommymiza6@gmail.com'),
(27, 870267, 'tommymiza6@gmail.com'),
(28, 651846, 'tommymiza6@gmail.com'),
(29, 476392, 'tommymiza6@gmail.com'),
(30, 304579, 'tommymiza6@gmail.com'),
(31, 784064, 'tommymiza6@gmail.com');

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

CREATE TABLE `commentaires` (
  `id` int(11) NOT NULL,
  `id_demande` int(11) NOT NULL,
  `content` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `commentaires`
--

INSERT INTO `commentaires` (`id`, `id_demande`, `content`, `created`) VALUES
(9, 46, 'test', '2024-01-18 07:36:34'),
(10, 46, 'Encore un test', '2024-01-18 07:39:17'),
(12, 47, 'Encore un test', '2024-01-18 17:52:48');

-- --------------------------------------------------------

--
-- Structure de la table `demandes`
--

CREATE TABLE `demandes` (
  `id` int(11) NOT NULL,
  `nom_patient` varchar(100) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `datenais` date NOT NULL,
  `tel` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `rdv` date DEFAULT NULL,
  `id_type` int(11) NOT NULL,
  `id_medecin` int(11) DEFAULT NULL,
  `lieu` varchar(255) NOT NULL,
  `date_rdv` date DEFAULT NULL,
  `ordonnance` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `demandes`
--

INSERT INTO `demandes` (`id`, `nom_patient`, `email`, `datenais`, `tel`, `created_at`, `rdv`, `id_type`, `id_medecin`, `lieu`, `date_rdv`, `ordonnance`) VALUES
(44, 'MIZA Tommy', 'tommymiza6@gmail.com', '2024-01-02', '0336350015', '2024-01-15 17:17:04', NULL, 2, 1, 'Athis', '2024-01-16', NULL),
(46, 'TEST Tettt', NULL, '2024-01-26', '0336350015', '2024-01-18 07:34:20', NULL, 8, 1, 'Savigny', '2024-01-30', NULL),
(47, 'MIZA Tommy', '', '2024-01-09', '0336350015', '2024-01-18 17:52:26', NULL, 6, 1, '', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `id_envoyeur` int(11) NOT NULL,
  `id_receveur` int(11) NOT NULL,
  `message` text NOT NULL,
  `lu` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` varchar(100) NOT NULL,
  `ajout` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `id_envoyeur`, `id_receveur`, `message`, `lu`, `created_at`, `ajout`) VALUES
(138, 17, 1, 'coucou', 1, 'Fri Dec 22 2023 08:21:09 GMT+0300 (Arabian Standard Time)', '2023-12-22 05:21:09'),
(139, 1, 17, 'Oui salut', 1, 'Fri Dec 22 2023 08:21:19 GMT+0300 (Arabian Standard Time)', '2023-12-22 05:21:19'),
(140, 17, 1, 'Bref', 1, 'Fri Dec 22 2023 08:21:28 GMT+0300 (Arabian Standard Time)', '2023-12-22 05:21:28'),
(141, 1, 17, 'Coucou', 1, 'Mon Jan 15 2024 18:02:46 GMT+0300 (Arabian Standard Time)', '2024-01-15 15:02:46'),
(142, 17, 1, 'Oui', 1, 'Mon Jan 15 2024 18:07:28 GMT+0300 (Arabian Standard Time)', '2024-01-15 15:07:28'),
(143, 1, 17, 'Ouii', 1, 'Mon Jan 15 2024 18:08:59 GMT+0300 (Arabian Standard Time)', '2024-01-15 15:08:59'),
(144, 1, 17, 'Non', 1, 'Mon Jan 15 2024 18:09:12 GMT+0300 (Arabian Standard Time)', '2024-01-15 15:09:12'),
(145, 17, 1, 'Ouii', 1, 'Mon Jan 15 2024 18:09:19 GMT+0300 (Arabian Standard Time)', '2024-01-15 15:09:19'),
(146, 1, 17, 'Coucou', 1, 'Mon Jan 15 2024 19:48:20 GMT+0300 (Arabian Standard Time)', '2024-01-15 16:48:20'),
(147, 17, 1, 'Hola', 1, 'Mon Jan 15 2024 19:54:14 GMT+0300 (Arabian Standard Time)', '2024-01-15 16:54:14'),
(148, 17, 1, 'Coucou', 1, 'Mon Jan 15 2024 19:54:18 GMT+0300 (Arabian Standard Time)', '2024-01-15 16:54:18'),
(149, 17, 1, 'Coucou', 1, 'Mon Jan 15 2024 19:54:44 GMT+0300 (Arabian Standard Time)', '2024-01-15 16:54:44'),
(150, 17, 1, 'Non', 1, 'Mon Jan 15 2024 19:55:20 GMT+0300 (Arabian Standard Time)', '2024-01-15 16:55:20'),
(151, 17, 1, 'Coucou', 1, 'Mon Jan 15 2024 19:55:23 GMT+0300 (Arabian Standard Time)', '2024-01-15 16:55:23'),
(152, 17, 1, 'Bref', 1, 'Mon Jan 15 2024 19:59:29 GMT+0300 (Arabian Standard Time)', '2024-01-15 16:59:29'),
(153, 17, 1, 'Coucou', 1, 'Mon Jan 15 2024 20:00:14 GMT+0300 (Arabian Standard Time)', '2024-01-15 17:00:14'),
(154, 17, 1, 'Salut', 1, 'Tue Jan 16 2024 05:57:26 GMT+0300 (Arabian Standard Time)', '2024-01-16 02:57:26'),
(155, 1, 17, 'Ouii', 1, 'Tue Jan 16 2024 06:05:01 GMT+0300 (Arabian Standard Time)', '2024-01-16 03:05:01'),
(156, 17, 1, 'Salut', 1, 'Tue Jan 16 2024 06:13:30 GMT+0300 (Arabian Standard Time)', '2024-01-16 03:13:30'),
(157, 1, 17, 'Salut', 1, 'Tue Jan 16 2024 06:14:25 GMT+0300 (Arabian Standard Time)', '2024-01-16 03:14:25'),
(158, 17, 1, 'Bref', 1, 'Tue Jan 16 2024 06:25:33 GMT+0300 (Arabian Standard Time)', '2024-01-16 03:25:33'),
(159, 1, 17, 'Bref', 1, 'Tue Jan 16 2024 06:36:46 GMT+0300 (Arabian Standard Time)', '2024-01-16 03:36:46'),
(160, 1, 17, 'Coucou', 1, 'Tue Jan 16 2024 06:49:57 GMT+0300 (Arabian Standard Time)', '2024-01-16 03:49:57'),
(161, 17, 1, 'Salut', 1, 'Wed Jan 17 2024 06:45:08 GMT+0300 (Arabian Standard Time)', '2024-01-17 03:45:08'),
(162, 1, 17, 'Salut', 1, 'Wed Jan 17 2024 20:00:43 GMT+0300 (Arabian Standard Time)', '2024-01-17 17:00:43'),
(163, 17, 1, 'coucou', 1, 'Wed Jan 17 2024 20:23:06 GMT+0300 (Arabian Standard Time)', '2024-01-17 17:23:06'),
(164, 1, 17, 'Hehe', 1, 'Wed Jan 17 2024 20:23:16 GMT+0300 (Arabian Standard Time)', '2024-01-17 17:23:16'),
(165, 1, 17, 'Bref', 1, 'Wed Jan 17 2024 20:23:24 GMT+0300 (Arabian Standard Time)', '2024-01-17 17:23:24'),
(166, 17, 1, 'Quoi ?', 1, 'Wed Jan 17 2024 20:23:33 GMT+0300 (Arabian Standard Time)', '2024-01-17 17:23:33'),
(167, 1, 17, 'Hola', 1, 'Thu Jan 18 2024 06:24:58 GMT+0300 (Arabian Standard Time)', '2024-01-18 03:24:58'),
(168, 1, 17, 'ok', 1, 'Thu Jan 18 2024 10:57:59 GMT+0300 (Arabian Standard Time)', '2024-01-18 07:57:59');

-- --------------------------------------------------------

--
-- Structure de la table `soustypes`
--

CREATE TABLE `soustypes` (
  `id` int(11) NOT NULL,
  `nom_sous_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `soustypes`
--

INSERT INTO `soustypes` (`id`, `nom_sous_type`) VALUES
(1, 'PIED'),
(2, 'CHEVILLE');

-- --------------------------------------------------------

--
-- Structure de la table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `tokens`
--

INSERT INTO `tokens` (`id`, `id_user`, `token`, `created_at`) VALUES
(48, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMDcyODE2MjcxNiwiaWF0IjoxNzAwNzI4MTYyfQ.Cc3h92pEKERQXs9byCBCgQH2eLkPnDXz8JHqpoKVnnE', '2023-11-23 08:29:22'),
(49, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMDczMDA5MTc2OCwiaWF0IjoxNzAwNzMwMDkxfQ.qFe6GWK-sN1QoYel373qa3Doo67si4pyTE8fT0jH4lM', '2023-11-23 09:01:31'),
(50, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMDczMDQ5MDY1NiwiaWF0IjoxNzAwNzMwNDkwfQ.nEKWkNBOfAXdrtRw4hDDMjQ1-77KLovSSnwKmazcdmQ', '2023-11-23 09:08:10'),
(51, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMDczNjY1MjMxNSwiaWF0IjoxNzAwNzM2NjUyfQ.aZBz1t9GCVf_MBXjFgdPby1AsuHRgmKyWIHpUoWc-oQ', '2023-11-23 10:50:52'),
(53, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMDgyMzAxMzY4NywiaWF0IjoxNzAwODIzMDEzfQ.3EtIOiO9rA_rnu03ZIj4AnOwQ_w7XK8hIeesGCRDKN8', '2023-11-24 10:50:13'),
(55, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMDg0MjcxODg4OCwiaWF0IjoxNzAwODQyNzE4fQ.sRu4ihF-umzG2vRZuzt3O9y2_ni8-ZIWsCfCQMe3Wh4', '2023-11-24 16:18:38'),
(56, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMDkxOTE3MDQzNCwiaWF0IjoxNzAwOTE5MTcwfQ.xLh3_4H6oPWCSdewjS4spLXKnxmyu_yDHP6wvX-9Xps', '2023-11-25 13:32:50'),
(58, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMDkyNDM0NTgxNiwiaWF0IjoxNzAwOTI0MzQ1fQ.LWCyDhs9jav8EqT2JdE27y0cPAOOO5PjQ3iJbhcLGjc', '2023-11-25 14:59:05'),
(59, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMDkzMTM4MjMyMiwiaWF0IjoxNzAwOTMxMzgyfQ.yGyABqXVmVN1JIX8KTCGHbzgYb5LKchFts01zhuYOyY', '2023-11-25 16:56:22'),
(60, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTM2NjcxODU3NCwiaWF0IjoxNzAxMzY2NzE4fQ.rOKBF1v78lSh5NnT0bXyoth2ncmCmONJhhi_sDlC5OU', '2023-11-30 17:51:58'),
(61, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDEzOTM2MTc1MzAsImlhdCI6MTcwMTM5MzYxN30.PBQCISwnDUbVsl4DW-IWGxVn9mWK8zJLiN_6NhIq8KM', '2023-12-01 01:20:17'),
(62, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDEzOTcxMjYwNTYsImlhdCI6MTcwMTM5NzEyNn0.h64ztGFC8bG3ooeANGsTAElfivE3El8IhPWiMqLiB1U', '2023-12-01 02:18:46'),
(63, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDEzOTc1NDU2NTQsImlhdCI6MTcwMTM5NzU0NX0.v26tf9Vj5SzAcbJ_h9YNrylhrn_D1YI6v3N_C9hEwAc', '2023-12-01 02:25:45'),
(64, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDEzOTc4ODY2NTgsImlhdCI6MTcwMTM5Nzg4Nn0.LnLS45iNdynTQw1NSmv_iXDtuEA4y-8W-TJN7DTiinI', '2023-12-01 02:31:26'),
(65, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDE0MDAzMjMyMzAsImlhdCI6MTcwMTQwMDMyM30.RvyUpG3bcNWE4gs5nAURM3ZDuy62a0-tI3ctM6npSOg', '2023-12-01 03:12:03'),
(66, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTQxMDI5Mzc4MCwiaWF0IjoxNzAxNDEwMjkzfQ.I2lzxB2CpCyi0qFTpWf0GtqNGWuSWY-jhkScsOPdEX8', '2023-12-01 05:58:13'),
(67, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDE0MTAzNzAyODEsImlhdCI6MTcwMTQxMDM3MH0.nYzSX2yrNOE9G4wTOVTPSQ6PalJH7zQYuAbPJFYIqI4', '2023-12-01 05:59:30'),
(68, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTc4MTYxNTY1NywiaWF0IjoxNzAxNzgxNjE1fQ.ITdQ9-dd0eAEgT5Fy8Jyz15YU8KZ5VzSEkEh4ToKIcI', '2023-12-05 13:06:55'),
(69, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTgwNjYzMTQ2MywiaWF0IjoxNzAxODA2NjMxfQ.M1jMWLVffFyAte95FM5dj6Bmsrc4VbwKw-O3X8NY8AY', '2023-12-05 20:03:51'),
(70, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTgwNjcyOTU5NywiaWF0IjoxNzAxODA2NzI5fQ.x3rr8gP1bRGuOiE2y5UUEpf4UVS-xt7T5T3zaFD6DZc', '2023-12-05 20:05:29'),
(71, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDE4MDY3NzczMzksImlhdCI6MTcwMTgwNjc3N30.RnJZc4rLjDlAjLyJ7CTzAsV8litlfFUkMbmFdz_efjk', '2023-12-05 20:06:17'),
(72, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTgwODg1MDAwMiwiaWF0IjoxNzAxODA4ODUwfQ.4Jf2c6iNFKAFmEqzPkJ5FEJZG9zupYwD1nXjiEADiVo', '2023-12-05 20:40:50'),
(73, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDE4MDg4NzI2MzEsImlhdCI6MTcwMTgwODg3Mn0.KS_u8S5jxOqgnv0_iGgo2UFBOCVuWRvtvPqhhB7Yb2Y', '2023-12-05 20:41:12'),
(74, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTg4NTU4NTI0OSwiaWF0IjoxNzAxODg1NTg1fQ.jMibIPRgOaX3Bb4-lKWIkfhw-3o-ZsfBAf8dahNBIE0', '2023-12-06 17:59:45'),
(75, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDE4ODU2Mjg5ODYsImlhdCI6MTcwMTg4NTYyOH0.YUGjw7bKPMfFVGUZggmduG6xBsYCO1zaHY30UOurjKs', '2023-12-06 18:00:28'),
(76, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTg4NjUwMzc3MCwiaWF0IjoxNzAxODg2NTAzfQ.cVY9Dp3ox1IOLoUAN6p67KpmLSIc_TDtRfcPMuctmCg', '2023-12-06 18:15:03'),
(77, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDE4ODY4NDkzMjgsImlhdCI6MTcwMTg4Njg0OX0.zaPNfjkXdyy252TDnluVsu-bzzyY4onotyCWbCdiIsc', '2023-12-06 18:20:49'),
(78, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTk2NjE3NTM2NCwiaWF0IjoxNzAxOTY2MTc1fQ.-2xjBklV0mPopN0-6rfOUa3Ro1uCCxPtFPA_Wk_-olc', '2023-12-07 16:22:55'),
(79, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDE5NjYxODcwMDcsImlhdCI6MTcwMTk2NjE4N30.HZf3Y9aX3GEDoCwVydL5VfYMCPtYRawcypCzqikRVh0', '2023-12-07 16:23:07'),
(80, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMTk2NzA3MjY3OSwiaWF0IjoxNzAxOTY3MDcyfQ.eJBxM83JISFIydrh72rrRtkTicqbNNEAF35LW-4WgDc', '2023-12-07 16:37:52'),
(81, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMjAwNDA3MTUzMywiaWF0IjoxNzAyMDA0MDcxfQ.QDGzKwfSKy4T6IlQ1xhQ54BeYVlqt4mkQR2YcIS4S1g', '2023-12-08 02:54:31'),
(82, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDIwMDQxMDM2MzYsImlhdCI6MTcwMjAwNDEwM30.z2spxRjnAhnKKimCKG3ZRW-dyBM6wPbOvsjPTvkn4NU', '2023-12-08 02:55:03'),
(83, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDIwMDcwMjAxNjksImlhdCI6MTcwMjAwNzAyMH0.Uf2iPnEw7vkTS8eHAqnzMqMaF9Ko3ze5sobcITNtLWM', '2023-12-08 03:43:40'),
(84, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMjMwNTYxMDE0MSwiaWF0IjoxNzAyMzA1NjEwfQ.wBMbaDiOiqDzR4526Uvuo_Lh3KNZXvbw59WndgGPn_8', '2023-12-11 14:40:10'),
(85, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDIzMDU2Nzk4MTEsImlhdCI6MTcwMjMwNTY3OX0.qqGcFpjZI2EdtfNRZ3FgOQRPR9L08eK_s6pnfBHqqzU', '2023-12-11 14:41:19'),
(86, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMjMwNzQzMjI2NywiaWF0IjoxNzAyMzA3NDMyfQ.B13WMIrPXXbM3yTplOM_drOjxi6pBanqk-zvtRrWF08', '2023-12-11 15:10:32'),
(87, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMzIyMjMwMDU0NSwiaWF0IjoxNzAzMjIyMzAwfQ.U36FPxOsHio9-zHDGt-oGVoqBjccEhcJ4eWDtyLYbNM', '2023-12-22 05:18:20'),
(88, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDMyMjI0MzAzMDIsImlhdCI6MTcwMzIyMjQzMH0.X32Yv5-SdXQtLDiX_UKH6yVWuRuUw4rLtbKWNwkUr1o', '2023-12-22 05:20:30'),
(89, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwMzIyNDU0MzM0MCwiaWF0IjoxNzAzMjI0NTQzfQ.llM42n_J-EQg2kY04F9kBVX3Bcw1fJpPTB-CYym_2BU', '2023-12-22 05:55:43'),
(90, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDMyMjQ1NTkwMDMsImlhdCI6MTcwMzIyNDU1OX0.8m1WGXIOacpZHb4xiDq_bMn8glKOIYYKlxRRyySzCO8', '2023-12-22 05:55:59'),
(91, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDMyMjQ2NDM0MjgsImlhdCI6MTcwMzIyNDY0M30.ytllIf19RpdVnvEVBIHTx7z_-kcQxyxg5F4MpwDlSE8', '2023-12-22 05:57:23'),
(92, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwNTMzMDgyNTYwNiwiaWF0IjoxNzA1MzMwODI1fQ.-k9A5uy_trJtZzDvuWStCI7u0JlHMkxXNkaIplIvYPE', '2024-01-15 15:00:25'),
(93, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDUzMzEwNzgxNjQsImlhdCI6MTcwNTMzMTA3OH0.1nWd9Tma_s30V0AZaV0KeQ2vBrbWwDPIhpaRNGCBF48', '2024-01-15 15:04:38'),
(94, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwNTM0MDQzODMzMCwiaWF0IjoxNzA1MzQwNDM4fQ.rD6KwhU13i1npgQNqyaohs8IoC3Ze1Xbu2Yu9hj5H1M', '2024-01-15 17:40:38'),
(95, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDUzNDA0NTYyOTMsImlhdCI6MTcwNTM0MDQ1Nn0.9bFh2Y4rZOnVFIvZG1P6G4bZsE1kQ7y0RAl-DKCjWAM', '2024-01-15 17:40:56'),
(96, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDUzNzIwNjY1MDgsImlhdCI6MTcwNTM3MjA2Nn0.mhiFKILRGnFenP8hyK3kyNkru-M_HjaYbbBeh4trD3w', '2024-01-16 02:27:46'),
(97, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwNTM4Njg3NDgzMSwiaWF0IjoxNzA1Mzg2ODc0fQ.kCHOV_MWExOmWyv9R_FSRRgQJ0M4EpICnZ61JAo1LjM', '2024-01-16 06:34:34'),
(98, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwNTM5MDUxODkxNywiaWF0IjoxNzA1MzkwNTE4fQ.WXrIJ2fu6f-FHhrz_9z2Bw9qwLl-IZGh3yIkXI_FeAM', '2024-01-16 07:35:18'),
(99, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDU0NjIyNzcwMjQsImlhdCI6MTcwNTQ2MjI3N30.58Py5pOXGBZSS-0EcFmRzQYrxh5S5dPv9SroW6rgbxc', '2024-01-17 03:31:17'),
(100, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwNTUxMDM2OTIyMiwiaWF0IjoxNzA1NTEwMzY5fQ.fyRwfSKIsJfA43TNt905jJ2xqQ4BRSKm6eaqTfrMWNQ', '2024-01-17 16:52:49'),
(101, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDU1MTA4NjkxMDUsImlhdCI6MTcwNTUxMDg2OX0.NH_vBofj76Z6RV9cm8bf_dETGTiGKWVHZ-wHqJU6YSo', '2024-01-17 17:01:09'),
(102, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwNTU1NTQ3NDgzNywiaWF0IjoxNzA1NTU1NDc0fQ.hMUJHSNqCiYGsQC3ZTtsohYLO5Ila2QjnKKhlM9NcR4', '2024-01-18 05:24:34'),
(103, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRhdGUiOjE3MDU1NjQ3MDcyNDksImlhdCI6MTcwNTU2NDcwN30.EoE8e4VkgsmzPNsdgq6RzEwUyZapMBoRHdrbzi_cmZw', '2024-01-18 07:58:27'),
(104, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGF0ZSI6MTcwNjE3MDU2Njk2MCwiaWF0IjoxNzA2MTcwNTY2fQ.BT7oHMP6WqkONFIZR-oulES5GDvesVIJp4bBAfQbpfE', '2024-01-25 08:16:06');

-- --------------------------------------------------------

--
-- Structure de la table `types`
--

CREATE TABLE `types` (
  `id` int(11) NOT NULL,
  `nom_type` varchar(50) NOT NULL,
  `nom_sous_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `types`
--

INSERT INTO `types` (`id`, `nom_type`, `nom_sous_type`) VALUES
(2, 'TDM', 'VENTRE'),
(3, 'IRM', 'PIED'),
(5, 'ECHO', 'ABDOMINALE'),
(6, 'TDM', 'CHEVILLE'),
(7, 'TDM', 'POIGNET'),
(8, 'IRM', 'CERVEAU'),
(9, 'TDM', 'GENOUX');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `adresse` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` text NOT NULL,
  `rpps` varchar(50) NOT NULL,
  `role` enum('admin','radiologue','secretaire','medecin') NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `tel`, `adresse`, `email`, `password`, `rpps`, `role`, `is_verified`) VALUES
(1, 'Admin', '0344824468', 'Tanambao', 'admin@gmail.com', '$2b$10$srkZ0csYhp7MfHsqS5eHTuDsthS1rchw2AgYedfaQ1JAS5DQ1rPjK', '0315225422', 'admin', 1),
(17, 'Robert', '0336350015', 'Fianarantsoa', 'radiologue@gmail.com', '$2b$10$1VJlDfqg5KW2p9MIB.Hc8ecoGwvE5Yt.x4yqkrxaK2Zw0.aIRPCBC', '655', 'radiologue', 1);


--
-- Structure de la table `schedule`
--
CREATE TABLE `schedule` (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  date DATE Not NULL,
  shift VARCHAR(10) NOT NULL CHECK (shift in ('Morning', 'Afternoon', 'Noon','Evening', 'Night')), 
  types_id int(11) NOT NULL REFERENCES  types(id) ON  DELETE CASCADE, 
  person_id int(11) NOT NULL REFERENCES users(id), 
  message VARCHAR(100) DEFAULT NULL,
  type_of_schedule int(11) NOT NULL DEFAULT 0,
  copied_id VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `leave`
--
CREATE TABLE `leave` (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  type_of_leave VARCHAR(20) NOT NULL,
  person_id int(11) NOT NULL REFERENCES users(id), 
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Index pour les tables déchargées
--

--
-- Index pour la table `codes`
--
ALTER TABLE `codes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_demande` (`id_demande`);

--
-- Index pour la table `demandes`
--
ALTER TABLE `demandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_type` (`id_type`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_envoyeur` (`id_envoyeur`),
  ADD KEY `id_receveur` (`id_receveur`);

--
-- Index pour la table `soustypes`
--
ALTER TABLE `soustypes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Index pour la table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `codes`
--
ALTER TABLE `codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT pour la table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `demandes`
--
ALTER TABLE `demandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT pour la table `soustypes`
--
ALTER TABLE `soustypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT pour la table `types`
--
ALTER TABLE `types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD CONSTRAINT `commentaires_ibfk_1` FOREIGN KEY (`id_demande`) REFERENCES `demandes` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `demandes`
--
ALTER TABLE `demandes`
  ADD CONSTRAINT `demandes_ibfk_1` FOREIGN KEY (`id_type`) REFERENCES `types` (`id`);

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`id_receveur`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`id_envoyeur`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT; 



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
