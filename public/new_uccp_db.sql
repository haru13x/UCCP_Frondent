-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 07, 2025 at 02:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uccp`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `attendees` int(11) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `image`, `start_date`, `start_time`, `end_date`, `end_time`, `category`, `organizer`, `contact`, `attendees`, `venue`, `address`, `latitude`, `longitude`, `description`, `barcode`, `created_by`, `status_id`, `created_at`, `updated_at`) VALUES
(8, 'TEST', 'event-images/1751781182.jfif', '2025-10-10', '07:00:00', '2025-10-10', '21:00:00', 'TEST', 'TEST', 'TEST', 10, 'UCCP Zamboanguita', '35XX+JQ2, Acupanda, Zamboanguita, Negros Oriental, Philippines', 9.0990176, 123.1994018, 'TEST', '20250706_0553028', NULL, 1, '2025-07-05 21:53:02', '2025-07-05 21:53:02');

-- --------------------------------------------------------

--
-- Table structure for table `event_programs`
--

CREATE TABLE `event_programs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `activity` varchar(255) NOT NULL,
  `speaker` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_qrcodes`
--

CREATE TABLE `event_qrcodes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `qr_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_sponsors`
--

CREATE TABLE `event_sponsors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `donated` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `attendees` int(11) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`id`, `title`, `start_date`, `end_date`, `time`, `category`, `organizer`, `contact`, `attendees`, `venue`, `address`, `latitude`, `longitude`, `description`, `created_by`, `status_id`, `created_at`, `updated_at`) VALUES
(1, 'UCCP CELEBRATION MEETING', '2025-06-26', '2025-06-27', NULL, NULL, 'Janice Conde', 'TEST', 5, 'UCCP Church', 'FJPX+Q4R, Abellanosa St, Cagayan De Oro City, Misamis Oriental, Philippines', 8.4869860, 124.6477562, 'meeting fot the UCCP Celebration', NULL, 1, '2025-06-23 04:41:21', '2025-06-24 02:57:35'),
(2, 'TEST TODAY MEETING', '2025-06-24', '2025-06-24', NULL, NULL, 'TEST', 'TEST', 10, 'USTP Science Complex Building', 'FMP4+7C2, Cagayan De Oro City, Misamis Oriental, Philippines', 8.4856414, 124.6560284, 'TEST', NULL, 1, '2025-06-24 02:56:38', '2025-06-24 02:56:38');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_06_18_000002_create_statuses', 1),
(6, '2025_06_18_122336_create_user_details', 1),
(7, '2025_06_18_122354_create_roles', 1),
(8, '2025_06_18_122442_create_permissions', 1),
(9, '2025_06_18_122525_create_role_permission', 1),
(10, '2025_06_18_123504_create_sex', 1),
(11, '2025_06_19_123227_create_events', 2),
(12, '2025_06_23_123308_meeting_table', 3),
(14, '2025_06_23_125838_create_event_qrcodes_table', 4),
(15, '2025_06_28_053011_create_event_programs_table', 5),
(16, '2025_06_28_053106_create_event_sponsors_table', 5);

-- --------------------------------------------------------

--
-- Table structure for table `nationality`
--

CREATE TABLE `nationality` (
  `id` int(11) NOT NULL,
  `description` varchar(100) NOT NULL,
  `isactive1` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nationality`
--

INSERT INTO `nationality` (`id`, `description`, `isactive1`) VALUES
(1, 'Filipino', 1),
(2, 'American', 1),
(3, 'Japanese', 1),
(4, 'British', 1),
(5, 'Canadian', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `code`, `description`, `created_by`, `status_id`, `created_at`, `updated_at`, `group_id`) VALUES
(6, 'View Users', 'view_users', 'Can view user list', 1, 0, NULL, NULL, 1),
(7, 'Add User', 'add_user', 'Can add new users', 1, 0, NULL, NULL, 1),
(8, 'Edit User', 'edit_user', 'Can update users', 1, 0, NULL, NULL, 1),
(9, 'Delete User', 'delete_user', 'Can delete users', 1, 0, NULL, NULL, 1),
(10, 'Generate User Report', 'report_users', 'Can generate user reports', 1, 0, NULL, NULL, 1),
(11, 'View Events', 'view_events', 'Can view event list', 1, 0, NULL, NULL, 2),
(12, 'Add Event', 'add_event', 'Can add new events', 1, 0, NULL, NULL, 2),
(13, 'Edit Event', 'edit_event', 'Can edit events', 1, 0, NULL, NULL, 2),
(14, 'Delete Event', 'delete_event', 'Can delete events', 1, 0, NULL, NULL, 2),
(15, 'Generate Event Report', 'report_events', 'Can generate event reports', 1, 0, NULL, NULL, 2),
(16, 'View Dashboard', 'view_dashboard', 'Can access the dashboard', 1, 0, NULL, NULL, 3),
(17, 'can view roles', 'view_roles', 'can view Roles Components', 1, 1, '2025-07-01 12:31:52', '2025-07-01 12:31:52', 1),
(18, 'Can View Report', 'view_report', 'Can View report', 1, 1, NULL, NULL, 4);

-- --------------------------------------------------------

--
-- Table structure for table `permission_groups`
--

CREATE TABLE `permission_groups` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `status_id` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permission_groups`
--

INSERT INTO `permission_groups` (`id`, `name`, `code`, `description`, `created_by`, `status_id`, `created_at`, `updated_at`) VALUES
(1, 'User Management', 'user_mgmt', 'Manage user accounts and roles', 1, 1, '2025-07-01 11:35:00', '2025-07-01 11:35:00'),
(2, 'Event Management', 'event_mgmt', 'Manage event data and schedules', 1, 1, '2025-07-01 11:35:00', '2025-07-01 11:35:00'),
(3, 'Dashboard', 'dashboard', 'Access dashboard only', 1, 1, '2025-07-01 11:35:00', '2025-07-01 11:35:00'),
(4, 'Report', 'report', 'Reports Group', 1, 1, '2025-07-05 10:04:21', '2025-07-05 10:04:21');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `qrcodes`
--

CREATE TABLE `qrcodes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` int(11) NOT NULL,
  `barcode` varchar(20) NOT NULL,
  `qr_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `qrcodes`
--

INSERT INTO `qrcodes` (`id`, `event_id`, `barcode`, `qr_path`, `created_at`, `updated_at`) VALUES
(1, 8, '20250706_0553028', 'qrcodes/event-8-1EkDapu9.png', '2025-07-05 21:53:02', '2025-07-05 21:53:02');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `created_by`, `status_id`, `created_at`, `updated_at`) VALUES
(5, 'SUPER ADMIN', 'SA', 'SUPER ADMIN', 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01');

-- --------------------------------------------------------

--
-- Table structure for table `role_permission`
--

CREATE TABLE `role_permission` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permission`
--

INSERT INTO `role_permission` (`id`, `role_id`, `permission_id`, `status_id`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 5, 6, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(3, 5, 7, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(4, 5, 8, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(5, 5, 9, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(6, 5, 10, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(7, 5, 15, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(8, 5, 14, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(9, 5, 13, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(10, 5, 12, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(11, 5, 11, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(12, 5, 16, 1, 1, '2025-07-01 03:47:01', '2025-07-01 03:47:01'),
(13, 5, 17, 1, NULL, '2025-07-01 12:35:50', '2025-07-01 12:35:50'),
(14, 6, 12, 1, 1, '2025-07-01 04:44:29', '2025-07-05 01:33:58'),
(15, 6, 11, 1, 1, '2025-07-01 04:44:29', '2025-07-05 01:33:07'),
(16, 6, 13, 1, 1, '2025-07-01 04:44:29', '2025-07-05 01:33:58'),
(17, 6, 14, 1, 1, '2025-07-01 04:44:29', '2025-07-05 01:33:58'),
(18, 6, 15, 1, 1, '2025-07-01 04:44:29', '2025-07-05 01:33:58'),
(19, 7, 8, 2, 1, '2025-07-01 04:56:28', '2025-07-01 04:56:28'),
(20, 7, 6, 2, 1, '2025-07-01 04:56:28', '2025-07-01 04:56:28'),
(21, 7, 7, 2, 1, '2025-07-01 04:56:28', '2025-07-01 04:56:28'),
(22, 7, 9, 2, 1, '2025-07-01 04:56:28', '2025-07-01 04:56:28'),
(23, 7, 10, 2, 1, '2025-07-01 04:56:28', '2025-07-01 04:56:28'),
(25, 6, 16, 1, 1, '2025-07-03 03:49:17', '2025-07-03 03:49:17'),
(26, 6, 6, 2, 1, '2025-07-05 01:33:07', '2025-07-05 01:33:58'),
(27, 5, 18, 1, 1, '2025-07-05 02:05:36', '2025-07-05 02:05:36'),
(28, 2, 11, 1, 1, '2025-07-05 02:21:46', '2025-07-05 02:27:38');

-- --------------------------------------------------------

--
-- Table structure for table `sexes`
--

CREATE TABLE `sexes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sexes`
--

INSERT INTO `sexes` (`id`, `name`, `code`, `description`, `status_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'male', 'm', 'male', 1, 8, NULL, NULL),
(2, 'Female', 'F', 'Female', 1, 8, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `statuses`
--

CREATE TABLE `statuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `statuses`
--

INSERT INTO `statuses` (`id`, `name`, `code`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Active', 'active', 'Active', '2025-06-18 13:38:39', '2025-06-18 13:38:39'),
(2, 'Inactive', 'inactive', 'Inactive', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `api_token` varchar(80) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `email_verified_at`, `password`, `api_token`, `role_id`, `status_id`, `created_by`, `remember_token`, `created_at`, `updated_at`) VALUES
(8, 'Super Admin', 'sa', 'sa', NULL, '$2y$10$eos/KOXXU.NibuBhfsn5oObmEgdxZ8eZLkJIsyfch.p5Z6jqUzgA.', 'dvkg7E1rsy7XzqOsgrDOZmnLEWJxg80q75QE1IklikCCKayHrd7FdUrAlgJy', 5, 1, NULL, NULL, '2025-06-19 04:25:56', '2025-07-05 21:28:39');

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `sex_id` int(11) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `municipal` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `church` varchar(255) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`id`, `user_id`, `first_name`, `middle_name`, `last_name`, `birthdate`, `age`, `sex_id`, `phone_number`, `civil_status`, `nationality`, `religion`, `address`, `barangay`, `municipal`, `province`, `church`, `created_by`, `status_id`, `created_at`, `updated_at`) VALUES
(4, 8, 'Super', 'admin', 'ADMIN', NULL, NULL, 1, '09556246587', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8, 1, '2025-06-19 04:25:56', '2025-06-19 04:25:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `events_created_by_foreign` (`created_by`),
  ADD KEY `events_status_id_foreign` (`status_id`);

--
-- Indexes for table `event_programs`
--
ALTER TABLE `event_programs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_programs_event_id_foreign` (`event_id`);

--
-- Indexes for table `event_qrcodes`
--
ALTER TABLE `event_qrcodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_qrcodes_event_id_foreign` (`event_id`);

--
-- Indexes for table `event_sponsors`
--
ALTER TABLE `event_sponsors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_sponsors_event_id_foreign` (`event_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meetings_created_by_foreign` (`created_by`),
  ADD KEY `meetings_status_id_foreign` (`status_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nationality`
--
ALTER TABLE `nationality`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_unique` (`name`),
  ADD UNIQUE KEY `permissions_code_unique` (`code`),
  ADD KEY `permissions_created_by_foreign` (`created_by`),
  ADD KEY `permissions_status_id_foreign` (`status_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indexes for table `permission_groups`
--
ALTER TABLE `permission_groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `qrcodes`
--
ALTER TABLE `qrcodes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`),
  ADD UNIQUE KEY `roles_slug_unique` (`slug`),
  ADD KEY `roles_created_by_foreign` (`created_by`),
  ADD KEY `roles_status_id_foreign` (`status_id`);

--
-- Indexes for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_permission_role_id_permission_id_unique` (`role_id`,`permission_id`),
  ADD KEY `role_permission_permission_id_foreign` (`permission_id`),
  ADD KEY `role_permission_status_id_foreign` (`status_id`),
  ADD KEY `role_permission_created_by_foreign` (`created_by`);

--
-- Indexes for table `sexes`
--
ALTER TABLE `sexes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sexes_name_unique` (`name`),
  ADD UNIQUE KEY `sexes_code_unique` (`code`),
  ADD KEY `sexes_status_id_foreign` (`status_id`),
  ADD KEY `sexes_created_by_foreign` (`created_by`);

--
-- Indexes for table `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `statuses_name_unique` (`name`),
  ADD UNIQUE KEY `statuses_code_unique` (`code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_api_token_unique` (`api_token`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_details_user_id_foreign` (`user_id`),
  ADD KEY `user_details_created_by_foreign` (`created_by`),
  ADD KEY `user_details_status_id_foreign` (`status_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `event_programs`
--
ALTER TABLE `event_programs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `event_qrcodes`
--
ALTER TABLE `event_qrcodes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_sponsors`
--
ALTER TABLE `event_sponsors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `nationality`
--
ALTER TABLE `nationality`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `permission_groups`
--
ALTER TABLE `permission_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `qrcodes`
--
ALTER TABLE `qrcodes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `role_permission`
--
ALTER TABLE `role_permission`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `sexes`
--
ALTER TABLE `sexes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `events_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_qrcodes`
--
ALTER TABLE `event_qrcodes`
  ADD CONSTRAINT `event_qrcodes_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_sponsors`
--
ALTER TABLE `event_sponsors`
  ADD CONSTRAINT `event_sponsors_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `meetings_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `meetings_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD CONSTRAINT `role_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permission_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permission_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sexes`
--
ALTER TABLE `sexes`
  ADD CONSTRAINT `sexes_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sexes_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_details`
--
ALTER TABLE `user_details`
  ADD CONSTRAINT `user_details_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_details_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
