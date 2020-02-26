/** @jsx withSlots */
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  radioGroupName,
  IRadioGroupType,
  IRadioGroupProps,
  IRadioGroupState,
  IRadioGroupSlotProps,
  IRadioGroupRenderData,
  IRadioGroupContext
} from './RadioGroup.types';
import { compose, IUseComposeStyling } from '@uifabricshared/foundation-compose';
import { ISlots, withSlots } from '@uifabricshared/foundation-composable';
import { filterViewProps } from '../../utilities/RenderHelpers';
import { settings } from './RadioGroup.settings';
import { mergeSettings } from '@uifabricshared/foundation-settings';
import { foregroundColorTokens, textTokens } from '../../tokens';
import { useAsRadioGroupSelection } from '../../hooks';

export const RadioGroupContext = React.createContext<IRadioGroupContext>({
  selectedKey: '',
  onButtonSelect: (key: string) => {
    return;
  }
});

export const RadioGroup = compose<IRadioGroupType>({
  displayName: radioGroupName,

  usePrepareProps: (userProps: IRadioGroupProps, useStyling: IUseComposeStyling<IRadioGroupType>) => {
    const { label, ariaLabel, ...rest } = userProps;

    // This hook updates the Selected Button and calls the customer's onClick function. This gets called after a button is pressed.
    const data = useAsRadioGroupSelection(userProps.defaultSelectedKey ? userProps.defaultSelectedKey : '', userProps.onChange);

    const state: IRadioGroupState = {
      selectedKey: data.selectedKey,
      onChange: data.onChange
    };

    const styleProps = useStyling(userProps, (override: string) => state[override] || userProps[override]);

    const ariaRoles = {
      accessibilityRole: 'radiogroup',
      accessibilityLabel: ariaLabel ? ariaLabel : label
    };

    const slotProps = mergeSettings<IRadioGroupSlotProps>(styleProps, {
      root: { rest, ...ariaRoles },
      label: { children: label },
      container: rest
    });

    return { slotProps, state };
  },

  render: (Slots: ISlots<IRadioGroupSlotProps>, renderData: IRadioGroupRenderData, ...children: React.ReactNode[]) => {
    if (renderData.state == undefined) {
      return null;
    }

    return (
      <RadioGroupContext.Provider
        // Passes in the selected key and a hook function to update the newly selected button and call the client's onChange callback
        value={{
          selectedKey: renderData.state.selectedKey,
          onButtonSelect: renderData.state.onChange
        }}
      >
        <Slots.root>
          <Slots.label />
          <Slots.container>{children}</Slots.container>
        </Slots.root>
      </RadioGroupContext.Provider>
    );
  },

  settings: settings,
  slots: {
    root: View,
    label: Text,
    container: { slotType: View, filter: filterViewProps }
  },
  styles: {
    root: [],
    label: [foregroundColorTokens, textTokens],
    container: []
  }
});

export default RadioGroup;
