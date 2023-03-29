import { expect } from 'chai'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import page404 from '@/pages/404Page.vue'

describe('404Page.vue Component Test', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(page404, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    })
  })

  it('Mount test', () => {
    expect(wrapper.text()).to.include('404');
  })
})