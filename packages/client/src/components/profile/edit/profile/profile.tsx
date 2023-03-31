import React, { FC, FormEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@/components/avatar/avatar';
import Menu from '@/components/profile/menu';
import useForm from '@/features/authentication/hooks/use-validate';
import Input from '@/components/input/input';
import { ValidationProps } from '@/features/validation/validator';
import { MenuState, MenuType } from '@/components/profile/menu/menu.interface';
import AvatarForm from '@/components/profile/avatar-form';
import { updateProfileData } from '@/controllers/user-controllers';
import { IUserUpdateDataRequest } from '@/types/user';
import { LoadingSelectors } from '@/store/slices/loading-slice';
import { errorSelectors } from '@/store/slices/error-slice';
import { userSelectors } from '@/features/authentication';
import { IUserDTO } from '@/api/types';
import IMenuEditProfileData from './profile.interface';
import './profile.scss';

const validationSchema: Record<string, ValidationProps> = {
  first_name: {
    required: true,
  },
  second_name: {
    required: true,
  },
  login: {
    required: true,
  },
  phone: {
    required: true,
    isPhone: true,
  },
  display_name: {
    required: true,
  },
};

const EditProfile: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userState = useSelector(userSelectors.user);
  const { isLoading } = useSelector(LoadingSelectors.all);
  const { error } = useSelector(errorSelectors.all);

  const { first_name, second_name, login, phone, display_name } = userState.info as IUserDTO;

  const userMenuData: IMenuEditProfileData[] = [
    { key: 'Имя', name: 'first_name', value: first_name },
    { key: 'Фамилия', name: 'second_name', value: second_name },
    { key: 'Логин', name: 'login', value: login },
    { key: 'Телефон', name: 'phone', value: phone },
    { key: 'Имя в чате', name: 'display_name', value: display_name },
  ];

  const initValues = userMenuData.reduce((acc, { name, value }) => {
    acc[name] = value || '';

    return acc;
  }, {} as Record<string, string>);

  const { values, hasError, onChangeForm, getFieldProps, getFieldError, onBlurInput } = useForm({
    initValues,
    validationSchema,
  });

  const [isEditAvatar, setIsEditAvatar] = useState(false);

  const onSubmitForm = async (evt: FormEvent) => {
    evt.preventDefault();

    await updateProfileData({ data: values as IUserUpdateDataRequest, navigate, dispatch });
  };

  const onStartEditAvatar = useCallback(() => {
    setIsEditAvatar(true);
  }, [setIsEditAvatar]);

  const onFinishEditAvatar = useCallback(() => {
    setIsEditAvatar(false);
  }, [setIsEditAvatar]);

  return (
    <div className="profile-edit">
      <Avatar editable onClick={onStartEditAvatar}>{`${first_name} ${second_name}`}</Avatar>

      <div className="profile-edit__content">
        <form onChange={onChangeForm} onSubmit={onSubmitForm} autoComplete="off">
          <Menu
            className="profile-edit__menu"
            title={isLoading ? 'Загрузка...' : 'Сохранить'}
            state={hasError || error.title.length ? MenuState.ERROR : MenuState.SUCCESS}
            type={MenuType.SUBMIT}
            disabled={hasError || isLoading}>
            <div className="profile-edit__menu-content">
              {userMenuData.map(({ key, name }) => (
                <React.Fragment key={key}>
                  <label className="profile-edit__label">
                    {key}
                    <Input {...getFieldProps(name)} error={getFieldError(name)} onBlur={onBlurInput} />
                  </label>
                </React.Fragment>
              ))}
            </div>
          </Menu>
        </form>
      </div>
      {isEditAvatar && <AvatarForm onClose={onFinishEditAvatar} />}
    </div>
  );
};

export default EditProfile;
