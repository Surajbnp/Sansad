import { useEffect } from "react";

export const useTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | सांसद सुविधा केंद्र – सतना-मैहर`;
  }, [title]);
};