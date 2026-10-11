import React, { useRef, useCallback } from 'react'

import styles from './tabs.module.scss'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  badgeType?: 'default' | 'success' | 'error'
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: TabItem[]
  activeTabId: string
  onChange: (tabId: string) => void
  ariaLabel?: string
  className?: string
}

export function Tabs({
  tabs,
  activeTabId,
  onChange,
  ariaLabel = 'Navegação por abas',
  className = '',
}: TabsProps) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const enabledTabs = tabs.filter((tab) => !tab.disabled)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentId: string) => {
      const currentIndex = enabledTabs.findIndex((t) => t.id === currentId)

      if(currentIndex === -1) return

      let nextIndex = -1

      if(e.key === 'ArrowRight') {
        e.preventDefault()
        nextIndex = (currentIndex + 1) % enabledTabs.length
      } else if(e.key === 'ArrowLeft') {
        e.preventDefault()
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length
      } else if(e.key === 'Home') {
        e.preventDefault()
        nextIndex = 0
      } else if(e.key === 'End') {
        e.preventDefault()
        nextIndex = enabledTabs.length - 1
      }

      if(nextIndex !== -1) {
        const nextTab = enabledTabs[nextIndex]

        onChange(nextTab.id)
        const btn = tabRefs.current.get(nextTab.id)

        btn?.focus()
      }
    },
    [enabledTabs, onChange],
  )

  const currentTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0]

  return (
    <div className={`${styles.tabsContainer} ${className}`}>
      <div
        className={styles.tabList}
        role="tablist"
        aria-label={ariaLabel}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId

          return (
            <button
              key={tab.id}
              ref={(el) => {
                if(el) {
                  tabRefs.current.set(tab.id, el)
                } else {
                  tabRefs.current.delete(tab.id)
                }
              }}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge !== null && (
                <span
                  className={`${styles.badge} ${
                    tab.badgeType === 'error'
                      ? styles.badgeError
                      : tab.badgeType === 'success'
                        ? styles.badgeSuccess
                        : ''
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {currentTab && (
        <div
          id={`panel-${currentTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentTab.id}`}
          tabIndex={0}
          className={styles.tabPanel}
        >
          {currentTab.content}
        </div>
      )}
    </div>
  )
}
