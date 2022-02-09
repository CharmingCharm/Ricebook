import { mount } from 'enzyme';

import App from '../App';

describe('login and out', () => {

    let wrapper;
    let instance;
    let usernameField;
    let passwordField;
    let loginButton;

    beforeAll(async () => {
        localStorage.clear();
        wrapper = mount(<App />);
        instance = wrapper.instance();
        await instance.componentDidMount();
        usernameField = wrapper.find({ "data-test-id": "login-username" }).find("input");
        passwordField = wrapper.find({ "data-test-id": "login-password" }).find("input");
        loginButton = wrapper.find({ "data-test-id": "login-button" }).find("button");
    });

    it('login fail', () => {
        usernameField.simulate('change', { target: { value: 'Bret' } });
        passwordField.simulate('change', { target: { value: 'Kulas Ligh' } });
        loginButton.simulate('click');
        expect(wrapper.state('loginState')).toBeFalsy();
        expect(localStorage.length).toEqual(1);
    });

    it('login success and logout', () => {
        usernameField.simulate('change', { target: { value: 'Bret' } });
        passwordField.simulate('change', { target: { value: 'Kulas Light' } });
        loginButton.simulate('click');
        expect(wrapper.state('loginState')).toBeTruthy();
        expect(localStorage.length).toEqual(2);

        let logoutButton = wrapper.find({ "data-test-id": "logout-button" }).find("button");
        logoutButton.simulate('click');
        expect(wrapper.state('loginState')).toBeFalsy();
        expect(localStorage.length).toEqual(1);
    });

})

