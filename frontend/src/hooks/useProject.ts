import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProject, getProjects, updateProject, deleteProject } from "../api/project";
import { useToast } from "../components/common/Toast";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showToast("프로젝트를 추가했습니다.");
    },
    onError: () => {
      showToast("프로젝트 추가에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateProject>[1] }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showToast("프로젝트를 수정했습니다.");
    },
    onError: () => {
      showToast("프로젝트 수정에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showToast("프로젝트를 삭제했습니다.");
    },
    onError: () => {
      showToast("프로젝트 삭제에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });
};
