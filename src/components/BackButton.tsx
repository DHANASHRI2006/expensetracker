
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ButtonProps } from '@/components/ui/button';

interface BackButtonProps extends ButtonProps {
  // Additional properties can be added here
}

const BackButton = ({ className, ...props }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      onClick={() => navigate(-1)}
      className={`mb-4 bg-white border-purple hover:bg-purple/10 ${className || ''}`}
      {...props}
    >
      <ArrowLeft className="h-4 w-4 mr-2 text-purple" />
      <span className="text-purple font-medium">Back</span>
    </Button>
  );
};

export default BackButton;
