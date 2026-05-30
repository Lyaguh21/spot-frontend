import { useRegisterMutation } from "@/entities/auth";
import { setUser } from "@/entities/user/model/userSlice";

import { useAppDispatch, useNotifications } from "@/shared/lib";
import { SpotTextInput, SpotPasswordInput, SpotButton } from "@/shared/ui";
import { Box, Center, Anchor, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  username: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const { showError, showSuccess } = useNotifications();
  const [step, setStep] = useState<1 | 2>(1);

  const form = useForm<RegisterFormValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      username: "",
    },
    validate: {
      email: (v) =>
        /^\S+@\S+\.\S+$/.test(v) ? null : "Введите корректный email",
      password: (v) =>
        v.length >= 4 ? null : "Пароль должен содержать минимум 4 символа",
      confirmPassword: (v, values) =>
        v === values.password ? null : "Пароли не совпадают",
      name: (v) => (v.trim().length > 0 ? null : "Введите имя"),
      username: (v) => (v.trim().length > 0 ? null : "Введите username"),
    },
  });

  const validateStepOne = () => {
    const errors: Partial<Record<keyof RegisterFormValues, string>> = {};

    if (!/^\S+@\S+\.\S+$/.test(form.values.email)) {
      errors.email = "Введите корректный email";
    }

    if (form.values.password.length < 4) {
      errors.password = "Пароль должен содержать минимум 4 символа";
    }

    if (form.values.confirmPassword !== form.values.password) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    form.setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStepTwo = () => {
    const errors: Partial<Record<keyof RegisterFormValues, string>> = {};

    if (form.values.name.trim().length === 0) {
      errors.name = "Введите имя";
    }

    if (form.values.username.trim().length === 0) {
      errors.username = "Введите username";
    }

    form.setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStepOne()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!validateStepTwo()) {
        return;
      }

      const { email, password, name, username } = form.values;
      const data = await register({ email, password, name, username }).unwrap();
      dispatch(setUser(data.user));
      showSuccess("Вы зарегистрировались в аккаунт");
      navigate("/");
      form.reset();
    } catch (error: any) {
      showError(error.data.message);
    }
  };

  return (
    <Box
      mih="100vh"
      px="md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack gap="xl">
        <Center>
          <img src="/icons/FullLogo.svg" alt="Logo" width={300} />
        </Center>

        <Stack gap={0}>
          <Text fz="28" c="white" ta="center" style={{ letterSpacing: "1px" }}>
            Создание аккаунта
          </Text>
          <Text
            fz="16"
            fw={600}
            c="dimmedColor.0"
            ta="center"
            style={{ letterSpacing: "1px" }}
          >
            Заполните данные для регистрации
          </Text>
        </Stack>

        {/* Форма */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {step === 1 ? (
              <>
                <SpotTextInput
                  label="Почта"
                  placeholder="Введите ваш email"
                  size="lg"
                  radius="lg"
                  {...form.getInputProps("email")}
                />

                <SpotPasswordInput
                  label="Пароль"
                  placeholder="Введите ваш пароль"
                  size="lg"
                  radius="lg"
                  {...form.getInputProps("password")}
                />

                <SpotPasswordInput
                  label="Подтвердите пароль"
                  placeholder="Введите ваш пароль еще раз"
                  size="lg"
                  radius="lg"
                  {...form.getInputProps("confirmPassword")}
                />

                <SpotButton
                  type="button"
                  fullWidth
                  size="lg"
                  radius="lg"
                  mt="md"
                  onClick={handleNextStep}
                >
                  Далее
                </SpotButton>
              </>
            ) : (
              <>
                <SpotTextInput
                  label="Логин"
                  placeholder="Введите логин"
                  size="lg"
                  radius="lg"
                  {...form.getInputProps("username")}
                />

                <SpotTextInput
                  label="Имя"
                  placeholder="Введите ваше настоящее имя"
                  size="lg"
                  radius="lg"
                  {...form.getInputProps("name")}
                />

                <SpotButton
                  type="submit"
                  fullWidth
                  size="lg"
                  radius="lg"
                  mt="md"
                >
                  Зарегистрироваться
                </SpotButton>

                <Anchor
                  c="dimmed"
                  fw={600}
                  ta="center"
                  onClick={() => setStep(1)}
                  style={{ cursor: "pointer" }}
                >
                  Назад
                </Anchor>
              </>
            )}
          </Stack>
        </form>

        <Text fz="md" fw={600} c="dimmedColor.0" ta="center">
          Есть аккаунт?{" "}
          <Anchor
            c="primary"
            fw={700}
            onClick={() => navigate("/auth/login")}
            style={{ cursor: "pointer" }}
          >
            Войти
          </Anchor>
        </Text>
      </Stack>
    </Box>
  );
}
