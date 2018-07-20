# Getting started

## Overview

* [Rules](getting-started.md#rules)
* [Messages](getting-started.md#messages)

## Introduction

Validation is the essential part of any form. React Advanced Form offers flexible, multi-layer vaidation system to suit any needs.

This section is meant to give a quick overview of how to start with the validation in your forms, as well as giving some features of what to expect from the validation experience.

Please see the respective sections of "Validation" documentation for more detailed information.

## Rules

A good place to start is to declare some validation rules. With React Advanced Form you can target the fields by `name` and `type`, providing as many validation rules as you need.

### Features

* **Application-wide rules**. Make all the forms in your application abide by the set of validation rules without any effort at all.
* **Form-wide rules.** Got some validation rules applicable to that one form only? Just pass it as a `rules` prop and see it working. You can also extend validation messages to prevent code repetition.
* **Advanced logic.** How much it would take to set the field as valid if it equals to another field? Well, now it's one line with React Advanced Form.

**Read more on** [**Validation rules**](rules.md)**.**

## Messages

Validation messages always follow the corresponding rules. In React Advanced Form those two are completely separated, allowing you to have multi-lingual validation messages while using the same validation rules.

### Features

* **Flexibility.** Utilize any known data to compose a proper message: use `value`, `fieldProps`, `fields` and even `form` references to craft the validation message you need.
* **Precision.** Return specific message for specific rule natively, forget about those work-arounds.
* **Fallback messages.** A reach fallback algorithm grants you a precise control over which messages is being displayed at the moment. Missing a message for the rejected validation rule? We have got you covered!

**Read more on** [**Validation messages**](messages.md)**.**

