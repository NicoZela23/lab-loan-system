// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\features\feedback\components\ServiceRatingForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ServiceRatingFormData, RATING_QUESTIONS, RatingQuestionResponses } from '../../../types/feedback';
import StarRating from '../../../components/feedback/StarRating';
import { ChatBubbleLeftRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ServiceRatingFormProps {
  reservationId: number;
  onSubmit: (data: ServiceRatingFormData) => void;
  onCancel?: () => void;
}

export default function ServiceRatingForm({ reservationId, onSubmit, onCancel }: ServiceRatingFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<{ comment: string }>();
  const [questionRatings, setQuestionRatings] = useState<RatingQuestionResponses>({});
  const [overallRating, setOverallRating] = useState<number>(0);
  
  const handleQuestionRatingChange = (questionIndex: number, rating: number) => {
    setQuestionRatings(prev => ({
      ...prev,
      [questionIndex]: rating
    }));
    
    // Calcular el promedio de todas las calificaciones como calificación general
    const ratings = Object.values({ ...questionRatings, [questionIndex]: rating });
    const average = ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
    setOverallRating(Math.round(average));
  };
  
  const handleOverallRatingChange = (rating: number) => {
    setOverallRating(rating);
  };
  
  const onFormSubmit = (formData: { comment: string }) => {
    // Combinamos los datos del formulario con las calificaciones
    const data: ServiceRatingFormData = {
      reservationId,
      rating: overallRating,
      comment: formData.comment
    };
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 text-left">
      <div className="space-y-4">
        <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tu opinión es importante</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Ayúdanos a mejorar nuestro servicio calificando tu experiencia
          </p>
        </div>
        
        <div className="space-y-4">
          {RATING_QUESTIONS.map((question, index) => (
            <div key={index} className="py-3">
              <StarRating 
                label={question} 
                onRatingChange={(rating) => handleQuestionRatingChange(index, rating)}
              />
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 mr-2" />
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Comentarios adicionales</h4>
          </div>
          <textarea
            className="input-field"
            rows={4}
            placeholder="¿Tienes algún comentario o sugerencia para mejorar nuestro servicio?"
            {...register('comment')}
          />
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
              Calificación general:
            </span>
            <StarRating 
              initialRating={overallRating} 
              onRatingChange={handleOverallRatingChange}
              size="lg"
            />
          </div>
          
          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Omitir
              </button>
            )}
            <button
              type="submit"
              disabled={overallRating === 0}
              className={`btn-primary flex items-center ${overallRating === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              Enviar evaluación
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}