import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudies, createStudy, updateStudy, deleteStudy } from "../api/study";
import { useToast } from "../components/common/Toast";

export const useStudies = () => {
  return useQuery({
    queryKey: ["studies"],
    queryFn: getStudies,
  });
};

export const useCreateStudy = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      showToast("학습 기록을 추가했습니다.");
    },
    onError: () => {
      showToast("학습 기록 추가에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};

export const useUpdateStudy = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateStudy>[1] }) =>
      updateStudy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      showToast("학습 기록을 수정했습니다.");
    },
    onError: () => {
      showToast("학습 기록 수정에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};

export const useDeleteStudy = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      showToast("학습 기록을 삭제했습니다.");
    },
    onError: () => {
      showToast("학습 기록 삭제에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};
