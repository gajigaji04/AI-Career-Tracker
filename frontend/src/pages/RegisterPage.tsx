import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import { register as registerUser } from "../api/auth";
import type { ExperienceLevel } from "../types/auth";
import AuthLayout from "../components/layouts/AuthLayout";
import styles from "./RegisterPage.module.css";

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "STUDENT", label: "학생" },
  { value: "JOB_SEEKER", label: "취준생" },
  { value: "NEW_DEVELOPER", label: "신입 개발자" },
  { value: "JUNIOR_DEVELOPER", label: "주니어 개발자" },
  { value: "EXPERIENCED_DEVELOPER", label: "경력 개발자" },
];

const STACK_OPTIONS = [
  "React",
  "TypeScript",
  "Node.js",
  "Java",
  "Python",
  "Spring",
  "Vue",
  "Next.js",
];

const registerSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식을 입력해주세요."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호를 다시 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
    nickname: z.string().min(1, "닉네임을 입력해주세요."),
    jobTitle: z.string().optional(),
    experienceLevel: z.string().optional(),
    interestedStack: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

type PasswordStrength = { score: 0 | 1 | 2 | 3; label: string };

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, label: "" };

  const varietyCount = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12 && varietyCount >= 2) score += 1;
  if (varietyCount >= 3) score += 1;

  if (score <= 1) return { score: 1, label: "약함" };
  if (score === 2) return { score: 2, label: "보통" };
  return { score: 3, label: "강함" };
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { interestedStack: [] },
  });

  const selectedStack = watch("interestedStack") ?? [];
  const password = watch("password") ?? "";
  const strength = getPasswordStrength(password);

  const toggleStack = (stack: string) => {
    const next = selectedStack.includes(stack)
      ? selectedStack.filter((s) => s !== stack)
      : [...selectedStack, stack];
    setValue("interestedStack", next);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError("");
    try {
      await registerUser({
        email: values.email,
        password: values.password,
        name: values.name,
        nickname: values.nickname,
        jobTitle: values.jobTitle || undefined,
        experienceLevel: values.experienceLevel
          ? (values.experienceLevel as ExperienceLevel)
          : undefined,
        interestedStack: values.interestedStack,
      });
      navigate("/login", { state: { registered: true } });
    } catch {
      setSubmitError("이미 사용 중인 이메일이거나 요청 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <AuthLayout>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>몇 가지 정보만 입력하면 바로 시작할 수 있어요.</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              className={styles.input}
              {...register("email")}
            />
            {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>비밀번호</label>
              <input
                type="password"
                placeholder="8자 이상"
                className={styles.input}
                {...register("password")}
              />
              {errors.password && (
                <p className={styles.fieldError}>{errors.password.message}</p>
              )}
              {password && (
                <div className={styles.strengthMeter}>
                  <div className={styles.strengthBars}>
                    {[1, 2, 3].map((level) => (
                      <span
                        key={level}
                        className={`${styles.strengthBar} ${
                          level <= strength.score ? styles[`strength${strength.score}`] : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className={styles.strengthLabel}>{strength.label}</span>
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>비밀번호 확인</label>
              <input
                type="password"
                placeholder="비밀번호 재입력"
                className={styles.input}
                {...register("passwordConfirm")}
              />
              {errors.passwordConfirm && (
                <p className={styles.fieldError}>{errors.passwordConfirm.message}</p>
              )}
            </div>
          </div>
          <p className={styles.passwordHint}>영문/숫자 포함 8자 이상을 권장합니다.</p>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>이름</label>
              <input
                type="text"
                placeholder="홍길동"
                className={styles.input}
                {...register("name")}
              />
              {errors.name && <p className={styles.fieldError}>{errors.name.message}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>닉네임</label>
              <input
                type="text"
                placeholder="다른 사용자에게 보일 이름"
                className={styles.input}
                {...register("nickname")}
              />
              {errors.nickname && (
                <p className={styles.fieldError}>{errors.nickname.message}</p>
              )}
            </div>
          </div>

          <div className={styles.divider}>
            <span>선택 정보</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>현재/희망 직무</label>
            <input
              type="text"
              placeholder="예: 백엔드 개발자"
              className={styles.input}
              {...register("jobTitle")}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>경력 수준</label>
            <Controller
              control={control}
              name="experienceLevel"
              render={({ field }) => (
                <select {...field} className={styles.select}>
                  <option value="">선택 안 함</option>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>관심 기술 스택</label>
            <div className={styles.chipGroup}>
              {STACK_OPTIONS.map((stack) => (
                <button
                  key={stack}
                  type="button"
                  onClick={() => toggleStack(stack)}
                  className={`${styles.chip} ${
                    selectedStack.includes(stack) ? styles.chipActive : ""
                  }`}
                >
                  {stack}
                </button>
              ))}
            </div>
          </div>

          {submitError && <p className={styles.error}>{submitError}</p>}

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? <span className={styles.spinner} /> : "회원가입"}
          </button>
        </form>

        <p className={styles.footer}>
          이미 계정이 있으신가요? <Link to="/login" className={styles.link}>로그인</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
