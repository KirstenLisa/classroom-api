BEGIN;

TRUNCATE
  teachers,
  class_list,
  classroom_users,
  updates,
  homework,
  updates_comments,
  homework_comments
  RESTART IDENTITY CASCADE;

INSERT INTO teachers (teacher_name)
VALUES
('Mrs Krabappel'),
('Mr Bergstrom'),
('Mrs Hoover'),
('Mr Skinner'),
('Mr Flanders'),
('Mr Kupferberg'),
('Mr Chalmers'),
('Mrs Pommelhorst');

INSERT INTO class_list(class_name, class_teacher)
VALUES
('1A', 'Mrs Krabappel'),
('1B', 'Mr Bergstrom'),
('1C', 'Mrs Hoover'),
('2A', 'Mr Skinner'),
('2B', 'Mr Flanders'),
('2C', 'Mr Kupferberg');

INSERT INTO classroom_users(fullname, username, password, class_id, user_type)
VALUES
('Guy Inkognito', 'GuyI',  '$2a$12$29Dh0KjocX4MlV/XL1z6Iug5Sqa0TWRLvqJ4K8oPPa6ap2ZzrG.BO', 1, 'parent'),
('Susi Sonnenschein', 'Susi', '$2a$12$kz1RKDuyrQIY8JsfxzY18.9CWA9sMzG1k9W3SOzSGe6zttdn3GtKO', 2, 'student'),
('Max Mustermann', 'Maximaus', '$2a$12$saXYeqF8kCW39.4FCkGJyOEPtL18ei.ZkbxbH3U.6w8ZTtjY2Wb6C', 3, 'parent'),
('Else Kling', 'Klingtgut', '$2a$12$dRUJBdNHaeqi7u.FW6L4ieWyRTvNXSWgA0PKhyS7Dc.3alOwAFc7O', 4, 'student'),
('Guido Kretschmer', 'Maria', '$2a$12$bRcY6Sq7vJ8i12.DkaeUNuBtVzMm3ED80QSOvat1SByFyNpbCNtSy', 5, 'parent'),
('Kai Pflaume', 'Plaumenmus86', '$2a$12$VtUvgSFSmsGdIlh3uuWmUO9.ZVEAZuhIBTtwVv3sPeBg6gzbCkp0S', 6, 'student'),
('Edna Krabappel', 'E_Krabappel', '$2a$12$eVD0dd6RkawsuFPmV2Vk9OhODscKyL9b8Y7MPcQpVAzHw0gSCrp0m', 1, 'teacher'),
('Seymour Skinner', 'S_Skinner', '$2a$12$c3x5t0CjS6WJw4XDXNmSsulCWjisWaCn7LRehWgJLiKzOw23jMQdW', 2, 'teacher'),
('Ned Flanders', 'N_Flanders', '$2a$12$IKHqvRGNW.8aRehq2/BW9.Wr7VThMSnHb9dcLvKyGVWLwkr9JyryC', 3, 'teacher'),
('Jonas Bergstrom', 'J_Bergstrom', '$2a$12$o.cuJ2GivYGQ.vpukyBTgeuMlZAC.eRZbEHRFbkhIAwvhGC5zX3Ia', 4, 'teacher'),
('Selma Hoover', 'S_Hoover', '$2a$12$.qH/HdFS5dLmn6/8nyYtS.CxKzhooYeUj4xJv5bAM30rMQwL3YqG.', 5, 'teacher'),
('Antje Pommelhorst', 'A_Pommelhorst', '$2a$12$GyUo3.BCPlM8bhYoDeJA6.gHeis5DdpAzNWL42kow3ZyiUsGD2sUq', 6, 'teacher');

INSERT INTO updates(update_id, headline, content, class_id, author)
VALUES
(101, 'Update no. 1 for class 1A', 'Class 1A content 1', 1, 'Mrs Krabappel'),
(102, 'Update no. 2 for class 1A', 'Class 1A content 2', 1, 'Mr Kupferberg'),
(103, 'Update no. 3 for class 1A', 'Class 1A content 3', 1, 'Mrs Krabappel'),
(104, 'Update no. 4 for class 1A', 'Class 1A content 4', 1, 'Mrs Krabappel'),
(105, 'Update no. 1 for class 1B', 'Class 1B content 1', 2, 'Mr Bergstrom'),
(106, 'Update no. 2 for class 1B', 'Class 1B content 2', 2, 'Mrs Pommelhorst'),
(107, 'Update no. 3 for class 1B', 'Class 1B content 3', 2, 'Mrs Krabappel'),
(108, 'Update no. 4 for class 1B', 'Class 1B content 4', 2, 'Mrs Krabappel'),
(109, 'Update no. 1 for class 1C', 'Class 1C content 1', 3, 'Mr Skinner'), 
(110, 'Update no. 2 for class 1C', 'Class 1C content 2', 3, 'Mr Bergstrom'),
(111, 'Update no. 3 for class 1C', 'Class 1C content 3', 3, 'Mrs Krabappel'),
(112, 'Update no. 4 for class 1C', 'Class 1C content 4', 3, 'Mrs Hoover'),
(113, 'Update no. 1 for class 2A', 'Class 1B content 1', 4, 'Mr Bergstrom'), 
(114, 'Update no. 2 for class 2A', 'Class 2A content 2', 4, 'Mr Skinner'),
(115, 'Update no. 3 for class 2A', 'Class 2A content 3', 4, 'Mr Chalmers'),
(116, 'Update no. 4 for class 2A', 'Class 1B content 4', 4, 'Mr Flanders'),
(117, 'Update no. 1 for class 2B', 'Class 2B content 1', 5, 'Mr Flanders'),
(118, 'Update no. 2 for class 2B', 'Class 2B content 2', 5, 'Mr Chalmers'),
(119, 'Update no. 3 for class 2B', 'Class 2B content 3', 5, 'Mrs Hoover'),
(120, 'Update no. 4 for class 2B', 'Class 2B content 4', 5, 'Mrs Pommelhorst'),
(121, 'Update no. 1 for class 2C', 'Class 2C content 1', 6, 'Mr Skinner'),
(122, 'Update no. 2 for class 2C', 'Class 2C content 2', 6, 'Mrs Pommelhors'),
(123, 'Update no. 3 for class 2C', 'Class 2C content 3', 6, 'Mr Kupferberg'),
(124, 'Update no. 4 for class 2C', 'Class 2C content 4', 6, 'Mr Kupferberg');

INSERT INTO homework(homework_id, subject, homework, teacher_id, teacher_name, class_id)
VALUES
(11, 'Math', 'page 200 no. 1-3', 1, 'Mrs Krabappel', 1),
(12, 'Art', 'Draw a picture', 2, 'Mr Bergstrom', 1),
(13, 'History', 'Read page 20-30', 3, 'Mrs Hoover', 1),      
(14, 'Languages', 'Learn vocabulary', 4, 'Mr Skinner', 1),
(15, 'Literature', 'Write a poem', 5, 'Mr Flanders', 1),
(16, 'Music', 'Sing a song', 6, 'Mr Kupferberg', 1),
(17, 'Social Studies', 'Do something social', 7, 'Mr Chalmers', 1),
(18, 'Biology', 'Plant a tree', 8, 'Mrs Pommelhorst', 1),
(21, 'Math', 'count to 100', 1, 'Mrs Krabappel', 2), 
(22, 'Art', 'Make art', 2, 'Mr Bergstrom', 2),
(23, 'History', 'Make history', 3, 'Mrs Hoover', 2),      
(24, 'Languages', 'Speak', 4, 'Mr Skinner', 2),
(25, 'Literature', 'Write literature', 5, 'Mr Flanders', 2),
(26, 'Music', 'Write a song', 6, 'Mr Kupferberg', 2),
(27, 'Social Studies', 'Be social', 7, 'Mr Chalmers', 2),
(28, 'Biology', 'Feed your pet', 8, 'Mrs Pommelhorst', 2),      
(31, 'Math', 'subtract and divide', 1, 'Mrs Krabappel', 3), 
(31, 'Math', 'multiply', 1, 'Mrs Krabappel', 3), 
(32, 'Art', 'Go to the museum', 2, 'Mr Bergstrom', 3),
(33, 'History', 'Who was Napoleon?', 3, 'Mrs Hoover', 3),      
(34, 'Languages', 'Read something', 4, 'Mr Skinner', 3),
(35, 'Literature', 'What is your favourite book about?', 5, 'Mr Flanders', 3),
(36, 'Music', 'Listen to music', 6, 'Mr Kupferberg', 3),
(37, 'Social Studies', 'What is social?', 7, 'Mr Chalmers', 3),
(38, 'Biology', 'Catch a worm', 8, 'Mrs Pommelhorst', 3),    
(41, 'Math', 'More math homework', 1, 'Mrs Krabappel', 4), 
(42, 'Art', 'Take photos of your pet', 2, 'Mr Bergstrom', 4), 
(42, 'Art', 'More art homework', 2, 'Mr Bergstrom', 4),
(43, 'History', 'More history homework', 3, 'Mrs Hoover', 4),      
(44, 'Languages', 'More languages homework', 4, 'Mr Skinner', 4),
(45, 'Literature', 'More literature homework', 5, 'Mr Flanders', 4),
(46, 'Music', 'More music homework', 6, 'Mr Kupferberg', 4),
(47, 'Social Studies', 'More social studies homework', 7, 'Mr Chalmers', 4),
(48, 'Biology', 'More biology homework', 8, 'Mrs Pommelhorst', 4),    
(51, 'Math', 'Math homework', 1, 'Mrs Krabappel', 5), 
(52, 'Art', 'Art homework', 2, 'Mr Bergstrom', 5), 
(53, 'History', 'Read history book p. 20-25', 3, 'Mrs Hoover', 5),
(53, 'History', 'History homework', 3, 'Mrs Hoover', 5),      
(54, 'Languages', 'Languages homework', 4, 'Mr Skinner', 5),
(55, 'Literature', 'Literature homework', 5, 'Mr Flanders', 5),
(56, 'Music', 'Music homework', 6, 'Mr Kupferberg', 5),
(57, 'Social Studies', 'Social studies homework', 7, 'Mr Chalmers', 5),
(58, 'Biology', 'Biology homework', 8, 'Mrs Pommelhorst', 5),
(61, 'Math', 'Math homework for class 2C', 1, 'Mrs Krabappel', 6), 
(62, 'Art', 'Art homework for class 2C', 2, 'Mr Bergstrom', 6), 
(63, 'History', 'History homework for class 2C', 3, 'Mrs Hoover', 6),
(64, 'Languages', 'Languages homework for class 2C', 4, 'Mr Skinner', 6),      
(64, 'Languages', 'More languages homework for class 2C', 4, 'Mr Skinner', 6),
(65, 'Literature', 'Literature homework for class 2C', 5, 'Mr Flanders', 6),
(66, 'Music', 'Music homework for class 2C', 6, 'Mr Kupferberg', 6),
(67, 'Social Studies', 'Social homework for class 2C', 7, 'Mr Chalmers', 6),
(68, 'Biology', 'Biology homework for class 2C', 8, 'Mrs Pommelhorst', 6);   

INSERT INTO updates_comments(comment, user_name, user_id, page_id)
VALUES
('comment no.1 update', 'GuyI', 1, 101),
('comment no. 2 update', 'Susi', 2, 102),
('comment no. 3 update', 'Maximaus', 3, 105),
('comment no. 4 update', 'Klingtgut', 4, 106),
('comment no. 5 update', 'Maria', 5, 110),
('comment no. 6 update', 'Plaumenmus86', 6, 111),
('comment no. 7 update', 'E_Krabappel', 7, 116),
('comment no. 8 update', 'S_Skinner', 8, 117),
('comment no. 9 update', 'N_Flanders', 9, 123),
('comment no. 10 update', 'GuyI', 1, 124);


INSERT INTO homework_comments(comment, user_name, user_id, page_id)
VALUES
('comment no.1 homework', 'GuyI', 1, 12),
('comment no. 2 homework', 'Susi', 2, 13),
('comment no. 3 homework', 'Maximaus', 3, 21),
('comment no. 4 homework', 'Klingtgut', 4, 22),
('comment no. 5 homework', 'Maria', 5, 33),
('comment no. 6 homework', 'Plaumenmus86', 6, 38),
('comment no. 7 homework', 'E_Krabappel', 7, 44),
('comment no. 8 homework', 'S_Skinner', 8, 55),
('comment no. 9 homework', 'N_Flanders', 9, 66),
('comment no. 10 homework', 'Susi', 2, 67); 
   


COMMIT;