/**
 * ZEROICHI-Front アプリケーション用ロギングユーティリティ
 * 環境に応じたログ出力を制御し、コンソールの整理とデバッグ効率向上を図る
 */

// ログレベルの定義
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

// 開発環境でのみデバッグログを有効にするフラグ
// 必要に応じて変更（デフォルトは無効）
const enableDebugLogs = false;

// 環境変数からログレベルを取得（未設定の場合はERRORレベルのみ表示）
const getLogLevel = (): LogLevel => {
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'development') {
    return LogLevel.ERROR; // 本番環境ではエラーのみ表示
  }
  
  // 開発環境では設定フラグに基づく
  return enableDebugLogs ? LogLevel.DEBUG : LogLevel.ERROR;
};

/**
 * ロガークラス - アプリケーション全体で一貫したロギングを提供
 */
class Logger {
  private currentLogLevel: LogLevel;

  constructor() {
    this.currentLogLevel = getLogLevel();
  }

  /**
   * エラーメッセージをログ出力（常に表示）
   */
  error(prefix: string, ...args: any[]): void {
    // エラーログは本番環境でも表示する
    console.error(`${prefix}:`, ...args);
  }

  /**
   * 警告メッセージをログ出力（WARNレベル以上の場合に表示）
   */
  warn(prefix: string, ...args: any[]): void {
    if (this.currentLogLevel >= LogLevel.WARN) {
      console.warn(`${prefix}:`, ...args);
    }
  }

  /**
   * 情報メッセージをログ出力（INFOレベル以上の場合に表示）
   */
  info(prefix: string, ...args: any[]): void {
    if (this.currentLogLevel >= LogLevel.INFO) {
      console.info(`${prefix}:`, ...args);
    }
  }

  /**
   * デバッグメッセージをログ出力（DEBUGレベルの場合に表示）
   */
  debug(prefix: string, ...args: any[]): void {
    if (this.currentLogLevel >= LogLevel.DEBUG) {
      console.log(`${prefix}:`, ...args);
    }
  }

  /**
   * 汎用ログメソッド - 従来のconsole.logの置き換えに使用
   * プレフィックスに基づいてログレベルを自動判別
   */
  log(prefix: string, ...args: any[]): void {
    const lowerPrefix = prefix.toLowerCase();
    
    if (lowerPrefix.includes('error')) {
      this.error(prefix, ...args);
    } else if (lowerPrefix.includes('warn')) {
      this.warn(prefix, ...args);
    } else if (lowerPrefix.includes('info')) {
      this.info(prefix, ...args);
    } else {
      this.debug(prefix, ...args);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const logger = new Logger();

/**
 * 既存コードとの互換性のために、単純なロガー関数も提供
 * 主にコードの段階的移行のために使用
 */
export const logMessage = (prefix: string, ...args: any[]): void => {
  logger.log(prefix, ...args);
};

export default logger;
