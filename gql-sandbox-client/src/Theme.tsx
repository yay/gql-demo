import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import React, { FC, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export type DesignContextValueType = {
  setThemeOptions: React.Dispatch<React.SetStateAction<ThemeOptions>>;
};

const DesignContext = React.createContext<DesignContextValueType>({
  setThemeOptions: () => {
    // The default setter will always throw. The valid state setter function will be provided by DesignProvider.
    throw new Error('Forgot to wrap component in DesignProvider');
  },
});

const useDesignContext = () => {
  return React.useContext(DesignContext);
};

export type DesignProviderProps = {
  children?: React.ReactNode;
};

const DesignProvider: FC<DesignProviderProps> = (props) => {
  const { children } = props;
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>({
    palette: {
      mode: 'light',
    },
    status: {
      danger: 'Achtung!',
    },
  });

  const theme = useMemo(() => {
    return createTheme(
      // Only the first argument (`options`) is processed by the `createTheme` function,
      // so we have to use `deepmerge` here.
      deepmerge(
        {
          components: {
            // MuiButtonBase: {
            //   defaultProps: {
            //     disableRipple: true,
            //   },
            // },
            MuiAutocomplete: {
              defaultProps: {},
            },
          },
        } satisfies ThemeOptions,
        themeOptions
      )
    );
  }, [themeOptions]);

  const designContextValue = useMemo(() => {
    return {
      setThemeOptions,
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <DesignContext.Provider value={designContextValue}>{children}</DesignContext.Provider>
    </ThemeProvider>
  );
};

export { DesignProvider, useDesignContext };
