import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateCoverLetter, generateInterviewQuestions, getAiAnalyses } from "../api/ai";
import { useToast } from "../components/common/Toast";

export const useAiAnalyses = (applicationId: string) => {
  return useQuery({
    queryKey: ["ai-analyses", applicationId],
    queryFn: () => getAiAnalyses(applicationId),
    enabled: !!applicationId,
  });
};

export const useGenerateCoverLetter = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: generateCoverLetter,
    onSuccess: (_data, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ["ai-analyses", applicationId] });
      showToast("자기소개서 초안을 생성했습니다.");
    },
    onError: () => {
      showToast("자기소개서 생성에 실패했습니다. 잠시 후 다시 시도해주세요.", "error");
    },
  });
};

export const useGenerateInterviewQuestions = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: generateInterviewQuestions,
    onSuccess: (_data, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ["ai-analyses", applicationId] });
      showToast("예상 면접 질문을 생성했습니다.");
    },
    onError: () => {
      showToast("면접 질문 생성에 실패했습니다. 잠시 후 다시 시도해주세요.", "error");
    },
  });
};
