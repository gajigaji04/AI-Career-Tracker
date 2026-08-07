import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getResumes, uploadResume, deleteResume } from "../api/resume";
import { useToast } from "../components/common/Toast";

export const useResumes = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      showToast("이력서를 업로드했습니다.");
    },
    onError: () => {
      showToast("이력서 업로드에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      showToast("이력서를 삭제했습니다.");
    },
    onError: () => {
      showToast("이력서 삭제에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};
