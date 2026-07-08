import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateCoverLetter, generateInterviewQuestions, getAiAnalyses } from "../api/ai";

export const useAiAnalyses = (applicationId: string) => {
  return useQuery({
    queryKey: ["ai-analyses", applicationId],
    queryFn: () => getAiAnalyses(applicationId),
    enabled: !!applicationId,
  });
};

export const useGenerateCoverLetter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateCoverLetter,
    onSuccess: (_data, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ["ai-analyses", applicationId] });
    },
  });
};

export const useGenerateInterviewQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateInterviewQuestions,
    onSuccess: (_data, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ["ai-analyses", applicationId] });
    },
  });
};
