import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudies, createStudy, updateStudy, deleteStudy } from "../api/study";

export const useStudies = () => {
  return useQuery({
    queryKey: ["studies"],
    queryFn: getStudies,
  });
};

export const useCreateStudy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
    },
  });
};

export const useUpdateStudy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateStudy>[1] }) =>
      updateStudy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
    },
  });
};

export const useDeleteStudy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
    },
  });
};
