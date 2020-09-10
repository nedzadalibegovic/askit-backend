DELIMITER $$

CREATE TRIGGER after_answer_insert
AFTER INSERT
ON Answers FOR EACH ROW
BEGIN
  UPDATE Questions
  SET AnswerCount = AnswerCount + 1
  WHERE QuestionID = NEW.QuestionID;
  
  UPDATE Users
  SET AnswerCount = AnswerCount + 1
  WHERE UserID = NEW.UserID;
END$$

CREATE TRIGGER after_answer_delete
AFTER DELETE 
ON Answers FOR EACH ROW
BEGIN
  UPDATE Questions
  SET AnswerCount = AnswerCount - 1
  WHERE QuestionID = OLD.QuestionID;
  
  UPDATE Users
  SET AnswerCount = AnswerCount - 1
  WHERE UserID = OLD.UserID;
END$$

CREATE TRIGGER after_question_rating_insert
AFTER INSERT
ON QuestionRatings FOR EACH ROW
BEGIN
  IF NEW.Rating = 'Like' THEN
    UPDATE Questions 
    SET LikeCount = LikeCount + 1 
    WHERE QuestionID = NEW.QuestionID;
  ELSE
    UPDATE Questions 
    SET DislikeCount = DislikeCount + 1 
    WHERE QuestionID = NEW.QuestionID;
  END IF;
END$$

CREATE TRIGGER after_question_rating_delete
AFTER DELETE
ON QuestionRatings FOR EACH ROW
BEGIN
  IF OLD.Rating = 'Like' THEN
    UPDATE Questions 
    SET LikeCount = LikeCount - 1 
    WHERE QuestionID = OLD.QuestionID;
  ELSE
    UPDATE Questions 
    SET DislikeCount = DislikeCount - 1 
    WHERE QuestionID = OLD.QuestionID;
  END IF;
END$$

CREATE TRIGGER after_answer_rating_insert
AFTER INSERT
ON AnswerRatings FOR EACH ROW
BEGIN
  IF NEW.Rating = 'Like' THEN
    UPDATE Answers
    SET LikeCount = LikeCount + 1 
    WHERE QuestionID = NEW.QuestionID AND UserID = NEW.AnswerUserID;
  ELSE
    UPDATE Answers 
    SET DislikeCount = DislikeCount + 1 
    WHERE QuestionID = NEW.QuestionID AND UserID = NEW.AnswerUserID;
  END IF;
END$$

CREATE TRIGGER after_answer_rating_delete
AFTER DELETE
ON AnswerRatings FOR EACH ROW
BEGIN
  IF OLD.Rating = 'Like' THEN
    UPDATE Answers
    SET LikeCount = LikeCount - 1 
    WHERE QuestionID = OLD.QuestionID AND UserID = OLD.AnswerUserID;
  ELSE
    UPDATE Answers
    SET DislikeCount = DislikeCount - 1 
    WHERE QuestionID = OLD.QuestionID AND UserID = OLD.AnswerUserID;
  END IF;
END$$

DELIMITER ;
