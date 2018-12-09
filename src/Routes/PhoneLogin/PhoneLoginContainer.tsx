import React from "react";
import { Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import {
  startPhoneVerification,
  startPhoneVerificationVariables,
} from "../../types/api";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneQueries.queries";

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

  public render() {
    const { countryCode, phoneNumber } = this.state;
    const fullNumber = `${countryCode}${phoneNumber}`;

    return (
      <PhoneSignInMutation
        mutation={PHONE_SIGN_IN}
        variables={{
          phoneNumber: fullNumber,
        }}
        onCompleted={(data: startPhoneVerification) => {
          const { StartPhoneVerification } = data;

          if (StartPhoneVerification.ok) {
            return;
          } else {
            toast.error(StartPhoneVerification.error);
          }
        }}
      >
        {(mutation, { loading }) => {
          const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
            event.preventDefault();

            const isValid = /^\+[0-9]{1,4}[0-9]{7,11}$/.test(fullNumber);
            const phoneNumberValid = /^[0-9]{9,11}$/.test(phoneNumber);

            // tslint:disable-next-line
            // console.log(countryCode, phoneNumber);

            if (isValid && phoneNumberValid) {
              mutation();
            } else {
              toast.error("Please write a valid phone number");
            }
          };

          return (
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={onSubmit}
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
}
export default PhoneLoginContainer;
