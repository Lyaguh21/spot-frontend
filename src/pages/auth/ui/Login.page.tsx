import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/entities/user";

import { ILoginRequest } from "@/entities/auth/model/type";
import { useAppDispatch, useNotifications } from "@/shared/lib";
import { Box, Center, Anchor, Stack, Text } from "@mantine/core";
import { useLoginMutation } from "@/entities/auth";
import { SpotButton, SpotTextInput } from "@/shared/ui";
import SpotPasswordInput from "@/shared/ui/SpotPasswordInput/SpotPasswordInput";

export default function Login() {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const { showError, showSuccess } = useNotifications();

  const form = useForm<ILoginRequest>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (v) =>
        /^\S+@\S+\.\S+$/.test(v) ? null : "Введите корректный email",
      password: (v) =>
        v.length >= 4 ? null : "Пароль должен содержать минимум 4 символа",
    },
  });

  const handleSubmit = async () => {
    try {
      const data = await login(form.values).unwrap();
      dispatch(setUser(data.user));
      showSuccess("Вы вошли в аккаунт");
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
            Вход в аккаунт
          </Text>
          <Text
            fz="16"
            fw={600}
            c="dimmedColor.0"
            ta="center"
            style={{ letterSpacing: "1px" }}
          >
            Добро пожаловать обратно!
          </Text>
        </Stack>

        {/* Форма */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
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

            <SpotButton type="submit" fullWidth size="lg" radius="lg" mt="md">
              Войти
            </SpotButton>
          </Stack>
        </form>

        <Text fz="md" fw={600} c="dimmedColor.0" ta="center">
          Нет аккаунта?{" "}
          <Anchor
            c="primary"
            fw={700}
            onClick={() => navigate("/auth/register")}
            style={{ cursor: "pointer" }}
          >
            Зарегистрироваться
          </Anchor>
        </Text>
      </Stack>
    </Box>
  );
}
