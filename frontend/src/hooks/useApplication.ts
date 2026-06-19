import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications, createApplication } from "../api/application";

export const useApplication = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
