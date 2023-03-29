import { expect } from 'chai'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { nextTick } from 'vue'
import LoginPage from '@/pages/LoginPage.vue'

describe('LoginPage.vue Component Test', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(LoginPage, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    })
  })

  it('Mount test', () => {
    expect(wrapper.text()).to.include('Login');
    expect(wrapper.text()).to.include('Email Address');
    expect(wrapper.text()).to.include('Password');
    expect(wrapper.text()).to.include('Forgot password?');
    expect(wrapper.text()).to.include('Don\'t have an account?');
  }),

  it('Forgot password test', () => {
    wrapper.setData({forgotPassword: true})
    nextTick(() => {
      expect(wrapper.text()).to.include('Forgot Password');
      expect(wrapper.text()).to.include('Email Address');
      expect(wrapper.text()).to.include('Send Reset Email');
      expect(wrapper.text()).to.include('Go Back');
    })
  })
})