import express from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { authMiddleware } from "../middlewares/auth"
import { fetchLessonQuiz, generateCourseQuizzesService, getAllCourses, getAllCoursesBySubject, getCourseWithLessons, getFilteredCourses, getLessonById, searchCourses } from "../controller/courseController";

const courseRouter = express.Router();

courseRouter.get("/search", asyncErrorHandler( searchCourses ));

courseRouter.get("/", asyncErrorHandler( getAllCourses));
courseRouter.get("/:subject/filter", asyncErrorHandler( getFilteredCourses ));
courseRouter.get("/:courseId", asyncErrorHandler( getCourseWithLessons));
courseRouter.get("/lessons/:lessonId", asyncErrorHandler( getLessonById));
// courseRouter.post("/lessons/:lessonId/complete", authMiddleware, asyncErrorHandler(markLessonAsComplete));
courseRouter.get("/subject/:subject",authMiddleware ,asyncErrorHandler( getAllCoursesBySubject));
courseRouter.post("/generate-quiz", asyncErrorHandler(generateCourseQuizzesService));
courseRouter.get("/fetch-quiz/:courseId", asyncErrorHandler(fetchLessonQuiz));


export default courseRouter;
