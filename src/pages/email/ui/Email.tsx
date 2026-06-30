import { Anchor, Box, Center, Group, Stack, Text, Title } from "@mantine/core";
import { IconCheck, IconShieldCheck } from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";
import { SpotButton, SpotCodeInput, SpotGlassCard } from "@/shared/ui";
import classes from "./Email.module.css";
import { confirmUserEmail, selectUser } from "@/entities/user";
import { useAppDispatch, useAppSelector, useNotifications } from "@/shared/lib";
import { useConfirmEmailMutation } from "@/entities/auth";

export default function Email() {
  const { showSuccess, showError } = useNotifications();
  const [confirmEmail, { isLoading }] = useConfirmEmailMutation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [code, setCode] = useState("");
  const submittedCodeRef = useRef<string | null>(null);
  const email = user.email || "";

  const confirmCode = useCallback(
    async (nextCode: string) => {
      if (nextCode.length !== 6 || isLoading) {
        return;
      }

      if (submittedCodeRef.current === nextCode) {
        return;
      }

      submittedCodeRef.current = nextCode;

      try {
        await confirmEmail({ email, code: nextCode }).unwrap();
        dispatch(confirmUserEmail());
        showSuccess("Почта успешно подтверждена");
        window.location.replace("/");
      } catch (error) {
        submittedCodeRef.current = null;
        showError("Что-то пошло не так");
      }
    },
    [confirmEmail, dispatch, email, isLoading, showError, showSuccess],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void confirmCode(code);
  };

  return (
    <Box className={classes.page}>
      <SpotGlassCard
        component="section"
        className={classes.confirmCard}
        aria-labelledby="email-title"
      >
        <Stack gap={0}>
          <Center>
            <Box className={classes.illustration} aria-hidden="true">
              <Box className={classes.envelopeBack} />
              <Box className={classes.envelope}>
                <Box className={classes.letter} />
                <Box className={classes.envelopeLeft} />
                <Box className={classes.envelopeRight} />
                <Box className={classes.envelopeFront} />
              </Box>
              <Center
                className={classes.checkBadge}
                bg={"var(--mantine-color-spotBlue-5)"}
              >
                <IconCheck size={30} stroke={3.4} />
              </Center>
            </Box>
          </Center>

          <Stack className={classes.copy} gap={0} align="center">
            <Title id="email-title" order={1}>
              Подтвердите вашу почту
            </Title>
            <Text>
              Мы отправили 6-значный код подтверждения на вашу почту{" "}
              <Text component="strong" inherit>
                {email}
              </Text>
            </Text>
          </Stack>

          <Box
            component="form"
            className={classes.form}
            onSubmit={handleSubmit}
          >
            <SpotCodeInput
              value={code}
              onChange={setCode}
              onComplete={(nextCode) => void confirmCode(nextCode)}
              length={6}
              type="number"
              autoFocus
              disabled={isLoading}
            />

            <Text className={classes.expires}>Код действует 10 минут</Text>

            <SpotButton
              mt={16}
              className={classes.submitButton}
              fullWidth
              size="lg"
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Подтвердить
            </SpotButton>
          </Box>

          <Text className={classes.resend}>
            Не получили код?{" "}
            <Anchor
              component="button"
              type="button"
              className={classes.linkButton}
              underline="never"
            >
              Отправить снова
            </Anchor>{" "}
            {/* <Text component="span" inherit>
              (00:45)
            </Text> */}
          </Text>
        </Stack>
      </SpotGlassCard>

      <SpotGlassCard
        component="section"
        className={classes.infoCard}
        aria-label="Информация о почте"
      >
        <Group gap={16} align="center" wrap="nowrap">
          <Center className={classes.infoIcon}>
            <IconShieldCheck size={40} stroke={1.9} />
          </Center>
          <Stack className={classes.infoText} gap={6}>
            <Title order={2} mb={0}>
              Безопасность важна
            </Title>
            <Text fz="sm" color="dimmed" mb={0}>
              Благодаря почте вы можете восстановить пароль и войти в аккаунт
            </Text>
          </Stack>
        </Group>
      </SpotGlassCard>
    </Box>
  );
}
