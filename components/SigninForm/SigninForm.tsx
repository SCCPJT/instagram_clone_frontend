import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Input from 'components/Input';
import Button from 'components/Button';
import { signin } from 'utils/api/auth';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import MemberContext from 'components/MemberProvider/MemberContext';
import { selectMember } from 'utils/api/member';

function SigninForm(): ReactElement {
  const [email, setEmail] = useState<string>('');
  const handleChangeEmail = useCallback<React.ChangeEventHandler<HTMLInputElement>>(({ target: { value } }) => {
    setEmail(value);
  }, []);
  const [password, setPassword] = useState<string>('');
  const handleChangePassword = useCallback<React.ChangeEventHandler<HTMLInputElement>>(({ target: { value } }) => {
    setPassword(value);
  }, []);
  const disabled = useMemo(() => {
    return !email || !password;
  }, [email, password]);
  const [, setCookie] = useCookies(['accessToken', 'refreshToken', 'grantType']);
  const router = useRouter();
  const { setMember } = useContext(MemberContext);
  const handleSubmit = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    async (e) => {
      e.preventDefault();
      const { accessToken, refreshToken, grantType } = await signin({ email, password });
      setCookie('accessToken', accessToken, { path: '/' });
      setCookie('refreshToken', refreshToken, { path: '/' });
      setCookie('grantType', grantType, { path: '/' });
      const { displayId, profileImageUrl } = await selectMember();
      setMember?.({ displayId, profileImageUrl });
      router.push('/');
    },
    [email, password],
  );
  return (
    <Form>
      <InputContainer>
        <Input label="이메일 주소" value={email} onChange={handleChangeEmail} />
      </InputContainer>
      <InputContainer>
        <Input label="비밀번호" value={password} onChange={handleChangePassword} type="password" />
      </InputContainer>
      <ButtonContainer>
        <Button theme="blue" full disabled={disabled} onClick={handleSubmit}>
          로그인
        </Button>
      </ButtonContainer>
    </Form>
  );
}

export default SigninForm;

const Form = styled.form`
  max-width: 350px;
`;

const InputContainer = styled.div`
  margin: 0 40px 10px;
`;

const ButtonContainer = styled.div`
  margin: 8px 40px;
`;
