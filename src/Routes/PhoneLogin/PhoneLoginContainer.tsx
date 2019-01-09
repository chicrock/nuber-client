import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import routes from "../../routes";
import {
  startPhoneVerification,
  startPhoneVerificationVariables,
} from "../../types/api";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneQueries";

interface IProps extends RouteComponentProps<any> {}

interface IState {
  countryCode: string;
  phoneNumber: string;
}

class PhoneSignInMutation extends Mutation<
  startPhoneVerification,
  startPhoneVerificationVariables
> {}

class PhoneLoginContainer extends React.Component<IProps, IState> {
  public state = {
    countryCode: "+82",
    phoneNumber: "",
  };

  public phoneMutation: MutationFn;

  public render() {
    const { history } = this.props;
    const { countryCode, phoneNumber } = this.state;
    const phone = `${countryCode}${phoneNumber}`;

    return (
      <PhoneSignInMutation
        mutation={PHONE_SIGN_IN}
        variables={{
          phoneNumber: phone,
        }}
        onCompleted={(data: startPhoneVerification) => {
          const { StartPhoneVerification } = data;

          if (StartPhoneVerification.ok) {
            toast.success("SMS Sent! Redirecting you...");

            setTimeout(() => {
              history.push({
                pathname: routes.verifyPhone,
                state: {
                  phone,
                },
              });
            }, 2000);
          } else {
            toast.error(StartPhoneVerification.error);
          }
        }}
      >
        {(phoneMutation, { loading }) => {
          this.phoneMutation = phoneMutation;

          return (
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
              loading={loading}
            />
          );
        }}
      </PhoneSignInMutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = event => {
    const {
      target: { name, value },
    } = event;

    this.setState({
      [name]: value,
    } as any);
  };

  public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const { countryCode, phoneNumber } = this.state;
    const phone = `${countryCode}${phoneNumber}`;

    const isValid = /^\+[0-9]{1,4}[0-9]{7,11}$/.test(phone);
    const phoneNumberValid = /^[0-9]{9,11}$/.test(phoneNumber);

    // tslint:disable-next-line
    // console.log(countryCode, phoneNumber);

    if (isValid && phoneNumberValid) {
      this.phoneMutation();
    } else {
      toast.error("Please write a valid phone number");
    }
  };
}
export default PhoneLoginContainer;
