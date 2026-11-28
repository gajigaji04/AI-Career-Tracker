import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import { register as registerUser } from "../api/auth";
import type { ExperienceLevel } from "../types/auth";
import AuthLayout from "../components/layouts/AuthLayout";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import SearchableCombobox from "../components/common/SearchableCombobox";
import Select from "../components/common/Select";
import styles from "./RegisterPage.module.css";

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "STUDENT", label: "학생" },
  { value: "JOB_SEEKER", label: "취준생" },
  { value: "NEW_DEVELOPER", label: "신입 개발자" },
  { value: "JUNIOR_DEVELOPER", label: "주니어 개발자" },
  { value: "EXPERIENCED_DEVELOPER", label: "경력 개발자" },
];

const YEARS_INPUT_LEVELS: ExperienceLevel[] = ["JUNIOR_DEVELOPER", "EXPERIENCED_DEVELOPER"];

const JOB_TITLE_OPTIONS = [
  "프론트엔드 개발자",
  "백엔드 개발자",
  "풀스택 개발자",
  "모바일 개발자 (iOS)",
  "모바일 개발자 (Android)",
  "데이터 엔지니어",
  "데이터 사이언티스트",
  "머신러닝/AI 엔지니어",
  "DevOps 엔지니어",
  "인프라/시스템 엔지니어",
  "QA 엔지니어",
  "보안 엔지니어",
  "게임 개발자",
  "임베디드 개발자",
  "프로덕트 매니저",
  "UI/UX 디자이너",
];

const STACK_OPTIONS = [
  // Frontend
  "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt.js", "TypeScript", "JavaScript",
  // Backend
  "Node.js", "Express", "NestJS", "Spring", "Spring Boot", "Django", "FastAPI", "Flask",
  "Ruby on Rails", "Laravel", "ASP.NET",
  // Languages
  "Java", "Python", "Go", "Rust", "Kotlin", "Swift", "C++", "C#", "PHP", "Ruby",
  // Database
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch",
  // DevOps/Infra
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "GitHub Actions", "Jenkins",
  // Mobile
  "React Native", "Flutter", "Android", "iOS",
];

const registerSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식을 입력해주세요."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호를 다시 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
    nickname: z.string().min(1, "닉네임을 입력해주세요."),
    phone: z
      .string()
      .regex(/^01[0-9]{8,9}$/, "휴대폰 번호 형식이 올바르지 않습니다. (예: 01012345678)")
      .optional()
      .or(z.literal("")),
    jobTitle: z.string().optional(),
    experienceLevel: z.string().optional(),
    yearsOfExperience: z.string().optional(),
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

/** 화면 안내용. 필수 규칙은 registerSchema(8자 이상)이고 나머지는 권장 */
const PASSWORD_GUIDES: { label: string; test: (pw: string) => boolean; required?: boolean }[] = [
  { label: "8자 이상", test: (pw) => pw.length >= 8, required: true },
  { label: "영문 포함", test: (pw) => /[a-zA-Z]/.test(pw) },
  { label: "숫자 포함", test: (pw) => /[0-9]/.test(pw) },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [stackFilter, setStackFilter] = useState("");

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
  const experienceLevel = watch("experienceLevel");
  const strength = getPasswordStrength(password);

  const visibleStackOptions = stackFilter
    ? STACK_OPTIONS.filter((s) => s.toLowerCase().includes(stackFilter.toLowerCase()))
    : STACK_OPTIONS;

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
        phone: values.phone || undefined,
        jobTitle: values.jobTitle || undefined,
        experienceLevel: values.experienceLevel
          ? (values.experienceLevel as ExperienceLevel)
          : undefined,
        yearsOfExperience: values.yearsOfExperience
          ? Number(values.yearsOfExperience)
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

        <form
          noValidate
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className={styles.form}
        >
          {/* ── 1. 계정 정보 ── */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionTitle}>
              <span className={`${styles.sectionStep} num`}>1</span>
              계정 정보
            </legend>

            <Input
              label="이메일"
              type="email"
              icon="mail"
              autoComplete="email"
              placeholder="example@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className={styles.field}>
              <PasswordInput
                label="비밀번호"
                icon="lock"
                autoComplete="new-password"
                placeholder="8자 이상"
                error={errors.password?.message}
                {...register("password")}
              />
              {password && (
                <div className={styles.strengthMeter}>
                  <div className={styles.strengthBars} aria-hidden="true">
                    {[1, 2, 3].map((level) => (
                      <span
                        key={level}
                        className={`${styles.strengthBar} ${
                          level <= strength.score ? styles[`strength${strength.score}`] : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className={styles.strengthLabel}>보안 강도 {strength.label}</span>
                </div>
              )}
              <ul className={styles.guides} aria-label="비밀번호 안내">
                {PASSWORD_GUIDES.map((guide) => {
                  const met = guide.test(password);
                  return (
                    <li key={guide.label} className={`${styles.guide} ${met ? styles.guideMet : ""}`}>
                      <Icon name={met ? "checkCircle" : "info"} size={14} />
                      {guide.label}
                      {!guide.required && <span className={styles.guideOptional}>(권장)</span>}
                      <span className="sr-only">{met ? " 충족" : " 미충족"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <PasswordInput
              label="비밀번호 확인"
              icon="lock"
              autoComplete="new-password"
              placeholder="비밀번호 재입력"
              error={errors.passwordConfirm?.message}
              {...register("passwordConfirm")}
            />
          </fieldset>

          {/* ── 2. 기본 정보 ── */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionTitle}>
              <span className={`${styles.sectionStep} num`}>2</span>
              기본 정보
            </legend>

            <div className={styles.row}>
              <Input
                label="이름"
                autoComplete="name"
                placeholder="홍길동"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="닉네임"
                autoComplete="nickname"
                placeholder="다른 사용자에게 보일 이름"
                error={errors.nickname?.message}
                {...register("nickname")}
              />
            </div>

            <Input
              label="휴대폰 번호"
              labelHint="선택"
              type="tel"
              icon="phone"
              autoComplete="tel"
              inputMode="numeric"
              placeholder="01012345678"
              error={errors.phone?.message}
              hint="등록해두면 이메일(아이디)을 잊었을 때 문자 인증으로 찾을 수 있습니다."
              {...register("phone")}
            />
          </fieldset>

          {/* ── 3. 커리어 정보 (선택) ── */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionTitle}>
              <span className={`${styles.sectionStep} num`}>3</span>
              커리어 정보
              <span className={styles.sectionOptional}>선택</span>
            </legend>
            <p className={styles.sectionDesc}>지금 건너뛰고 나중에 입력해도 됩니다.</p>

            <div className={styles.field}>
              <label htmlFor="register-job-title" className={styles.label}>
                현재/희망 직무
              </label>
              <Controller
                control={control}
                name="jobTitle"
                render={({ field }) => (
                  <SearchableCombobox
                    id="register-job-title"
                    options={JOB_TITLE_OPTIONS}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="검색하거나 직접 입력하세요"
                  />
                )}
              />
            </div>

            <div className={styles.row}>
              <Controller
                control={control}
                name="experienceLevel"
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value ?? ""}
                    label="경력 수준"
                    placeholder="선택 안 함"
                    options={EXPERIENCE_LEVELS}
                  />
                )}
              />

              {YEARS_INPUT_LEVELS.includes(experienceLevel as ExperienceLevel) && (
                <Input
                  label="경력 연차"
                  type="number"
                  min={0}
                  max={60}
                  placeholder="예: 3"
                  {...register("yearsOfExperience")}
                />
              )}
            </div>

            <div className={styles.field}>
              <Input
                label="관심 기술 스택"
                icon="search"
                placeholder="기술 스택 검색 (예: react)"
                value={stackFilter}
                onChange={(e) => setStackFilter(e.target.value)}
              />

              {selectedStack.length > 0 && (
                <div className={styles.selected}>
                  <span className={`${styles.selectedCount} num`}>{selectedStack.length}개 선택</span>
                  <ul className={styles.selectedList}>
                    {selectedStack.map((stack) => (
                      <li key={stack}>
                        <button
                          type="button"
                          className={styles.selectedChip}
                          onClick={() => toggleStack(stack)}
                          aria-label={`${stack} 선택 해제`}
                        >
                          {stack}
                          <Icon name="close" size={12} strokeWidth={2.25} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.chipGroup}>
                {visibleStackOptions.map((stack) => {
                  const active = selectedStack.includes(stack);
                  return (
                    <button
                      key={stack}
                      type="button"
                      onClick={() => toggleStack(stack)}
                      aria-pressed={active}
                      className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                    >
                      {active && <Icon name="check" size={12} strokeWidth={2.5} />}
                      {stack}
                    </button>
                  );
                })}
                {visibleStackOptions.length === 0 && (
                  <span className={styles.noResults}>검색 결과가 없습니다.</span>
                )}
              </div>
            </div>
          </fieldset>

          {submitError && (
            <p className={styles.error} role="alert">
              <Icon name="alertCircle" size={16} />
              {submitError}
            </p>
          )}

          <Button type="submit" fullWidth loading={isSubmitting} className={styles.submit}>
            회원가입
          </Button>
        </form>

        <p className={styles.footer}>
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className={styles.link}>
            로그인
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
