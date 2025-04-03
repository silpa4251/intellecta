import mongoose, { Schema, Document } from "mongoose";

interface ILesson extends Document {
    course: mongoose.Types.ObjectId;
    title: string;
    type: "video" | "quiz" | "exercise" | "article";
    tags: string[];
    url: string;
    content?: string;
    duration?: number;
    resources?: string[];
    order: number;
}

const LessonSchema: Schema = new Schema(
  {
    course:{
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title:{
        type: String,
        required: true, 
    },
    type: {
        type: String, 
        required: true,
        enum: ["video", "quiz", "exercise", "article"]
    },
    tags: { 
        type: [String], 
        required: true 
    },
    url: { 
        type: String
    },
    content: { 
        type: String 
    },
    duration: { 
        type: Number 
    },
    resources: { 
        type: [String] 
    },
    order: { 
        type: Number, 
        required: true 
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model<ILesson>("Lesson", LessonSchema);
export default Lesson;





