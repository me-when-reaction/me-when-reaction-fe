"use client"

import React, { useEffect } from 'react'
import { useGlobalState } from '@/utilities/store'
import classNames from 'classnames'
import { Alert } from 'flowbite-react'
import { animated, config, useSpring } from '@react-spring/web';

export default function TopAlert() {
  const [text, type, closeAlert] = useGlobalState(x => [x.alert.text, x.alert.type, x.alert.closeAlert]);
  const AnimatedAlert = animated(Alert);
  const animation = useSpring({
    opacity: (text.length > 0) ? 1 : 0,
    display: (text.length > 0) ? 'inline' : 'none',
    config: { ...config.stiff },
  });

  useEffect(() => {
    setTimeout(closeAlert, 5000);
  });

  return (
    <AnimatedAlert
      color={type}
      className={classNames(
        "absolute m-auto left-0 right-0 z-50 w-[70%]",
      )}
      onDismiss={closeAlert}
      style={{...animation}}
    >
      <span>{text}</span>
    </AnimatedAlert>
  )
}
