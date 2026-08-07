import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications, createApplication, updateApplication, deleteApplication } from "../api/application";
import { useToast } from "../components/common/Toast";

export const useApplication = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      showToast("지원 내역을 추가했습니다.");
    },
    onError: () => {
      showToast("지원 내역 추가에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateApplication>[1] }) =>
      updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      showToast("지원 내역을 수정했습니다.");
    },
    onError: () => {
      showToast("지원 내역 수정에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      showToast("지원 내역을 삭제했습니다.");
    },
    onError: () => {
      showToast("지원 내역 삭제에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};
