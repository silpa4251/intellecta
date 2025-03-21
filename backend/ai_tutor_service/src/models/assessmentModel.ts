import mongoose, { Schema, Document } from "mongoose";

interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  strengths: string[]; 
  weaknesses: string[]; 
  aiFeedback: string;
}

const AssessmentSchema: Schema = new Schema(
  {
    userId : { 
      type: Schema.Types.ObjectId, 
      ref: "User", required: true 
    },
    totalQuestions: { 
      type: Number, 
      required: true 
    },
    correctCount: { 
      type: Number, 
      required: true 
    },
    scorePercentage: { 
      type: Number, 
      required: true 
    },
    strengths: { 
      type: [String], 
      default: [] 
    },
    weaknesses: { 
      type: [String], 
      default: [] 
    },
    aiFeedback: {
      type: String, 
    }
  },
  { timestamps: true }
);

const Assessment = mongoose.model<IAssessment>("AssessmentResult", AssessmentSchema);
export default Assessment;
