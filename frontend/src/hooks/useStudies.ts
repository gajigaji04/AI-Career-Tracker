import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudies, createStudy } from "../api/study";

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
