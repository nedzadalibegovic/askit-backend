DELIMITER $$

CREATE TRIGGER after_question_rating_update
AFTER UPDATE
ON QuestionRatings FOR EACH ROW
BEGIN
  IF NEW.Rating = 'Like' THEN
    UPDATE Questions 
    SET LikeCount = LikeCount + 1,
        DislikeCount = DislikeCount - 1
    WHERE QuestionID = NEW.QuestionID;
  ELSE
    UPDATE Questions 
    SET DislikeCount = DislikeCount + 1,
        LikeCount = LikeCount - 1
    WHERE QuestionID = NEW.QuestionID;
  END IF;
END$$

CREATE TRIGGER after_answer_rating_update
AFTER UPDATE
ON AnswerRatings FOR EACH ROW
BEGIN
  IF NEW.Rating = 'Like' THEN
    UPDATE Answers
    SET LikeCount = LikeCount + 1,
        DislikeCount = DislikeCount - 1
    WHERE QuestionID = NEW.QuestionID AND UserID = NEW.AnswerUserID;
  ELSE
    UPDATE Answers 
    SET DislikeCount = DislikeCount + 1,
        LikeCount = LikeCount - 1
    WHERE QuestionID = NEW.QuestionID AND UserID = NEW.AnswerUserID;
  END IF;
END$$

DELIMITER ;